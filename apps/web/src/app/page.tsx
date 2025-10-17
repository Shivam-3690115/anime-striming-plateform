import Link from 'next/link';
import { Play, TrendingUp, Star, Search } from 'lucide-react';

interface Anime {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  rating: number;
  episodes: number;
  genre: string[];
}

// Placeholder data for demo
const featuredAnime: Anime[] = [
  {
    id: '1',
    title: 'Attack on Titan',
    description: 'Humanity fights for survival against giant humanoid Titans.',
    thumbnail: '/api/placeholder/300/400',
    rating: 9.0,
    episodes: 87,
    genre: ['Action', 'Drama', 'Fantasy'],
  },
  {
    id: '2',
    title: 'Demon Slayer',
    description: 'A young boy becomes a demon slayer after his family is slaughtered.',
    thumbnail: '/api/placeholder/300/400',
    rating: 8.7,
    episodes: 44,
    genre: ['Action', 'Adventure', 'Fantasy'],
  },
  {
    id: '3',
    title: 'My Hero Academia',
    description: 'A world where people with superpowers are the norm.',
    thumbnail: '/api/placeholder/300/400',
    rating: 8.4,
    episodes: 113,
    genre: ['Action', 'Comedy', 'School'],
  },
  {
    id: '4',
    title: 'One Piece',
    description: 'Follow Monkey D. Luffy on his quest to become King of the Pirates.',
    thumbnail: '/api/placeholder/300/400',
    rating: 8.9,
    episodes: 1000,
    genre: ['Action', 'Adventure', 'Comedy'],
  },
  {
    id: '5',
    title: 'Jujutsu Kaisen',
    description: 'A high school student joins a secret organization to fight curses.',
    thumbnail: '/api/placeholder/300/400',
    rating: 8.6,
    episodes: 24,
    genre: ['Action', 'Supernatural', 'School'],
  },
  {
    id: '6',
    title: 'Naruto',
    description: 'A young ninja seeks recognition and dreams of becoming the Hokage.',
    thumbnail: '/api/placeholder/300/400',
    rating: 8.3,
    episodes: 220,
    genre: ['Action', 'Adventure', 'Martial Arts'],
  },
];

const trendingAnime = featuredAnime.slice(0, 4);
const newReleases = featuredAnime.slice(2, 6);

export default function HomePage() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[80vh] w-full overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent z-10" />
        <div className="absolute inset-0 bg-[url('/api/placeholder/1920/1080')] bg-cover bg-center" />
        
        <div className="relative z-20 flex flex-col justify-center h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-5xl md:text-7xl font-bold mb-4 max-w-2xl">
            Watch Your Favorite Anime
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-xl">
            Stream thousands of anime series and movies in stunning HD quality
          </p>
          <div className="flex gap-4">
            <Link
              href="/browse"
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-md font-semibold transition"
            >
              <Play className="w-5 h-5" />
              Start Watching
            </Link>
            <Link
              href="/login"
              className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 text-white px-8 py-3 rounded-md font-semibold transition"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-black/95 backdrop-blur-sm border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-8">
              <Link href="/" className="text-2xl font-bold text-red-600">
                AnimeStream
              </Link>
              <div className="hidden md:flex gap-6">
                <Link href="/browse" className="hover:text-gray-300 transition">
                  Browse
                </Link>
                <Link href="/trending" className="hover:text-gray-300 transition">
                  Trending
                </Link>
                <Link href="/new" className="hover:text-gray-300 transition">
                  New Releases
                </Link>
                <Link href="/my-list" className="hover:text-gray-300 transition">
                  My List
                </Link>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button className="p-2 hover:bg-gray-800 rounded-full transition">
                <Search className="w-5 h-5" />
              </button>
              <Link
                href="/login"
                className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-md transition"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Trending Section */}
        <section className="mb-12">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="w-6 h-6 text-red-600" />
            <h2 className="text-3xl font-bold">Trending Now</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {trendingAnime.map((anime) => (
              <AnimeCard key={anime.id} anime={anime} />
            ))}
          </div>
        </section>

        {/* Featured Section */}
        <section className="mb-12">
          <div className="flex items-center gap-2 mb-6">
            <Star className="w-6 h-6 text-red-600" />
            <h2 className="text-3xl font-bold">Featured Anime</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {featuredAnime.map((anime) => (
              <AnimeCard key={anime.id} anime={anime} />
            ))}
          </div>
        </section>

        {/* New Releases Section */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6">New Releases</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {newReleases.map((anime) => (
              <AnimeCard key={anime.id} anime={anime} />
            ))}
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16">
          <h2 className="text-3xl font-bold text-center mb-12">
            Why Choose Our Platform?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              title="HD Streaming"
              description="Watch in crystal clear quality with adaptive streaming technology"
              icon="🎬"
            />
            <FeatureCard
              title="Vast Library"
              description="Access thousands of anime series and movies"
              icon="📚"
            />
            <FeatureCard
              title="Multi-Device"
              description="Watch on any device - TV, phone, tablet, or computer"
              icon="📱"
            />
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 border-t border-gray-800 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold text-red-600 mb-4">AnimeStream</h3>
              <p className="text-gray-400">
                Your premier destination for anime streaming
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/about">About Us</Link></li>
                <li><Link href="/contact">Contact</Link></li>
                <li><Link href="/careers">Careers</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/help">Help Center</Link></li>
                <li><Link href="/terms">Terms of Service</Link></li>
                <li><Link href="/privacy">Privacy Policy</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/licenses">Content Licenses</Link></li>
                <li><Link href="/dmca">DMCA</Link></li>
                <li><Link href="/cookies">Cookie Policy</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400">
            <p>© 2024 AnimeStream. All rights reserved.</p>
            <p className="mt-2 text-sm">
              All anime content is properly licensed. Please respect copyright laws.
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}

function AnimeCard({ anime }: { anime: Anime }) {
  return (
    <Link
      href={`/anime/${anime.id}`}
      className="group relative overflow-hidden rounded-lg transition-transform hover:scale-105"
    >
      <div className="aspect-[2/3] bg-gray-800">
        <div className="w-full h-full flex items-center justify-center text-gray-600">
          <Play className="w-16 h-16" />
        </div>
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="absolute bottom-0 p-4">
          <h3 className="font-semibold mb-1">{anime.title}</h3>
          <div className="flex items-center gap-2 text-sm text-gray-300">
            <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
            <span>{anime.rating}</span>
            <span>•</span>
            <span>{anime.episodes} eps</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

function FeatureCard({
  title,
  description,
  icon,
}: {
  title: string;
  description: string;
  icon: string;
}) {
  return (
    <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-400">{description}</p>
    </div>
  );
}
