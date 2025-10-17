#!/usr/bin/env node

/**
 * Database seeder script
 * Seeds the database with sample anime data for development
 */

const { Pool } = require('pg');
require('dotenv').config({ path: './services/api/.env' });

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  user: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_DATABASE || 'anime_platform',
});

const SAMPLE_ANIME = [
  {
    title: 'Attack on Titan',
    description: 'Humanity fights for survival against giant humanoid Titans in a walled city.',
    genres: ['Action', 'Drama', 'Fantasy'],
    rating: 9.0,
    episodeCount: 87,
    status: 'completed',
    releaseYear: 2013,
    studio: 'Wit Studio',
  },
  {
    title: 'Demon Slayer',
    description: 'A young boy becomes a demon slayer after his family is slaughtered and his sister is turned into a demon.',
    genres: ['Action', 'Adventure', 'Fantasy'],
    rating: 8.7,
    episodeCount: 44,
    status: 'ongoing',
    releaseYear: 2019,
    studio: 'ufotable',
  },
  {
    title: 'My Hero Academia',
    description: 'In a world where people with superpowers are the norm, a boy without powers dreams of becoming a hero.',
    genres: ['Action', 'Comedy', 'School'],
    rating: 8.4,
    episodeCount: 113,
    status: 'ongoing',
    releaseYear: 2016,
    studio: 'Bones',
  },
  {
    title: 'One Piece',
    description: 'Follow Monkey D. Luffy on his quest to become King of the Pirates.',
    genres: ['Action', 'Adventure', 'Comedy'],
    rating: 8.9,
    episodeCount: 1000,
    status: 'ongoing',
    releaseYear: 1999,
    studio: 'Toei Animation',
  },
  {
    title: 'Jujutsu Kaisen',
    description: 'A high school student joins a secret organization of sorcerers to fight curses.',
    genres: ['Action', 'Supernatural', 'School'],
    rating: 8.6,
    episodeCount: 24,
    status: 'ongoing',
    releaseYear: 2020,
    studio: 'MAPPA',
  },
];

async function seed() {
  console.log('Starting database seeding...');

  try {
    // Check if anime table exists
    const tableCheck = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'anime'
      );
    `);

    if (!tableCheck.rows[0].exists) {
      console.log('Anime table does not exist. Please run migrations first.');
      process.exit(1);
    }

    // Clear existing data
    console.log('Clearing existing anime data...');
    await pool.query('DELETE FROM anime');

    // Insert sample anime
    console.log('Inserting sample anime...');
    for (const anime of SAMPLE_ANIME) {
      await pool.query(
        `INSERT INTO anime (title, description, genres, rating, episode_count, status, release_year, studio, is_published)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, true)`,
        [
          anime.title,
          anime.description,
          anime.genres,
          anime.rating,
          anime.episodeCount,
          anime.status,
          anime.releaseYear,
          anime.studio,
        ]
      );
      console.log(`✓ Added: ${anime.title}`);
    }

    console.log('\nSeeding completed successfully!');
    console.log(`Total anime added: ${SAMPLE_ANIME.length}`);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

seed();
