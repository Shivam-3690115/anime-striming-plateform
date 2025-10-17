import express from 'express';
import { Pool } from 'pg';
import { createClient } from 'redis';

const app = express();
app.use(express.json());

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  user: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_DATABASE || 'anime_platform',
});

const redisClient = createClient({
  url: `redis://${process.env.REDIS_HOST || 'localhost'}:${process.env.REDIS_PORT || 6379}`,
});

redisClient.connect();

interface WatchHistory {
  userId: string;
  animeId: string;
  rating?: number;
  watchedAt: Date;
}

// Collaborative filtering recommendation algorithm
async function getCollaborativeRecommendations(
  userId: string,
  limit: number = 10
): Promise<string[]> {
  try {
    // Get user's watch history
    const userHistory = await pool.query(
      `SELECT anime_id, rating FROM watch_history WHERE user_id = $1`,
      [userId]
    );

    const userAnimeIds = userHistory.rows.map((row) => row.anime_id);

    if (userAnimeIds.length === 0) {
      return getPopularAnime(limit);
    }

    // Find similar users who watched the same anime
    const similarUsers = await pool.query(
      `
      SELECT user_id, COUNT(*) as common_count
      FROM watch_history
      WHERE anime_id = ANY($1) AND user_id != $2
      GROUP BY user_id
      ORDER BY common_count DESC
      LIMIT 50
    `,
      [userAnimeIds, userId]
    );

    const similarUserIds = similarUsers.rows.map((row) => row.user_id);

    if (similarUserIds.length === 0) {
      return getPopularAnime(limit);
    }

    // Get anime watched by similar users but not by current user
    const recommendations = await pool.query(
      `
      SELECT anime_id, COUNT(*) as score
      FROM watch_history
      WHERE user_id = ANY($1) AND anime_id != ALL($2)
      GROUP BY anime_id
      ORDER BY score DESC
      LIMIT $3
    `,
      [similarUserIds, userAnimeIds, limit]
    );

    return recommendations.rows.map((row) => row.anime_id);
  } catch (error) {
    console.error('Collaborative filtering error:', error);
    return [];
  }
}

// Content-based recommendation using genres
async function getContentBasedRecommendations(
  userId: string,
  limit: number = 10
): Promise<string[]> {
  try {
    // Get user's favorite genres from watch history
    const favoriteGenres = await pool.query(
      `
      SELECT UNNEST(a.genres) as genre, COUNT(*) as count
      FROM watch_history wh
      JOIN anime a ON wh.anime_id = a.id
      WHERE wh.user_id = $1
      GROUP BY genre
      ORDER BY count DESC
      LIMIT 5
    `,
      [userId]
    );

    const genres = favoriteGenres.rows.map((row) => row.genre);

    if (genres.length === 0) {
      return getPopularAnime(limit);
    }

    // Get watched anime to exclude
    const watched = await pool.query(
      `SELECT anime_id FROM watch_history WHERE user_id = $1`,
      [userId]
    );
    const watchedIds = watched.rows.map((row) => row.anime_id);

    // Find anime with similar genres
    const recommendations = await pool.query(
      `
      SELECT id, 
        (SELECT COUNT(*) FROM UNNEST(genres) g WHERE g = ANY($1)) as genre_match
      FROM anime
      WHERE id != ALL($2) AND is_published = true
      ORDER BY genre_match DESC, rating DESC
      LIMIT $3
    `,
      [genres, watchedIds.length > 0 ? watchedIds : [''], limit]
    );

    return recommendations.rows.map((row) => row.id);
  } catch (error) {
    console.error('Content-based filtering error:', error);
    return [];
  }
}

// Get popular anime as fallback
async function getPopularAnime(limit: number = 10): Promise<string[]> {
  try {
    const popular = await pool.query(
      `
      SELECT id FROM anime
      WHERE is_published = true
      ORDER BY rating DESC, created_at DESC
      LIMIT $1
    `,
      [limit]
    );

    return popular.rows.map((row) => row.id);
  } catch (error) {
    console.error('Popular anime error:', error);
    return [];
  }
}

// Hybrid recommendation combining both approaches
async function getHybridRecommendations(
  userId: string,
  limit: number = 10
): Promise<string[]> {
  const cacheKey = `recommendations:${userId}`;

  // Check cache
  const cached = await redisClient.get(cacheKey);
  if (cached) {
    return JSON.parse(cached);
  }

  const collaborative = await getCollaborativeRecommendations(userId, limit);
  const contentBased = await getContentBasedRecommendations(userId, limit);

  // Merge and deduplicate
  const recommendations = [
    ...new Set([...collaborative.slice(0, 7), ...contentBased.slice(0, 5)]),
  ].slice(0, limit);

  // Cache for 1 hour
  await redisClient.setEx(cacheKey, 3600, JSON.stringify(recommendations));

  return recommendations;
}

// API endpoints
app.get('/recommendations/:userId', async (req, res) => {
  const { userId } = req.params;
  const limit = parseInt(req.query.limit as string) || 10;

  try {
    const recommendations = await getHybridRecommendations(userId, limit);
    res.json({ userId, recommendations });
  } catch (error) {
    console.error('Recommendation error:', error);
    res.status(500).json({ error: 'Failed to get recommendations' });
  }
});

app.get('/trending', async (req, res) => {
  const limit = parseInt(req.query.limit as string) || 10;

  try {
    const cacheKey = 'trending:anime';
    const cached = await redisClient.get(cacheKey);

    if (cached) {
      return res.json({ trending: JSON.parse(cached) });
    }

    const trending = await pool.query(
      `
      SELECT anime_id, COUNT(*) as views
      FROM watch_history
      WHERE watched_at > NOW() - INTERVAL '7 days'
      GROUP BY anime_id
      ORDER BY views DESC
      LIMIT $1
    `,
      [limit]
    );

    const animeIds = trending.rows.map((row) => row.anime_id);
    await redisClient.setEx(cacheKey, 1800, JSON.stringify(animeIds));

    res.json({ trending: animeIds });
  } catch (error) {
    console.error('Trending error:', error);
    res.status(500).json({ error: 'Failed to get trending anime' });
  }
});

app.get('/similar/:animeId', async (req, res) => {
  const { animeId } = req.params;
  const limit = parseInt(req.query.limit as string) || 5;

  try {
    // Get anime genres
    const anime = await pool.query(
      `SELECT genres FROM anime WHERE id = $1`,
      [animeId]
    );

    if (anime.rows.length === 0) {
      return res.status(404).json({ error: 'Anime not found' });
    }

    const genres = anime.rows[0].genres;

    // Find similar anime
    const similar = await pool.query(
      `
      SELECT id, 
        (SELECT COUNT(*) FROM UNNEST(genres) g WHERE g = ANY($1)) as genre_match
      FROM anime
      WHERE id != $2 AND is_published = true
      ORDER BY genre_match DESC, rating DESC
      LIMIT $3
    `,
      [genres, animeId, limit]
    );

    res.json({ animeId, similar: similar.rows.map((row) => row.id) });
  } catch (error) {
    console.error('Similar anime error:', error);
    res.status(500).json({ error: 'Failed to get similar anime' });
  }
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'recommender' });
});

const PORT = process.env.PORT || 3003;
app.listen(PORT, () => {
  console.log(`Recommender service running on port ${PORT}`);
});
