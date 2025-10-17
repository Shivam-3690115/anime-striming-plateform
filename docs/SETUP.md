# Setup Guide

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: 18.x or higher
- **npm**: 9.x or higher  
- **Docker**: 24.x or higher
- **Docker Compose**: 2.x or higher
- **Git**: Latest version

Optional (for local development without Docker):
- **PostgreSQL**: 15.x or higher
- **Redis**: 7.x or higher
- **FFmpeg**: 4.x or higher (for transcoding service)

## Quick Start (Recommended)

### 1. Clone the Repository

```bash
git clone https://github.com/Shivam-3690115/anime-striming-plateform.git
cd anime-striming-plateform
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

Create environment files for each service:

```bash
# Backend API
cp services/api/.env.example services/api/.env

# Frontend
cp apps/web/.env.example apps/web/.env
```

Edit these files and configure your values. For local development, the default values should work with Docker Compose.

### 4. Start Services with Docker Compose

```bash
docker-compose up -d
```

This will start:
- PostgreSQL database (port 5432)
- Redis cache (port 6379)
- Elasticsearch (port 9200)
- NestJS API (port 3001)
- Next.js frontend (port 3000)

### 5. Access the Application

- **Frontend**: http://localhost:3000
- **API**: http://localhost:3001/api
- **API Documentation**: http://localhost:3001/api (Swagger UI will be available once implemented)

### 6. Verify Installation

Check that all services are running:

```bash
docker-compose ps
```

You should see all services in "Up" state.

## Manual Setup (Without Docker)

### 1. Install and Start PostgreSQL

```bash
# macOS (with Homebrew)
brew install postgresql@15
brew services start postgresql@15

# Ubuntu/Debian
sudo apt-get install postgresql-15
sudo systemctl start postgresql

# Create database
createdb anime_platform
```

### 2. Install and Start Redis

```bash
# macOS (with Homebrew)
brew install redis
brew services start redis

# Ubuntu/Debian
sudo apt-get install redis-server
sudo systemctl start redis
```

### 3. Install Elasticsearch (Optional)

```bash
# macOS (with Homebrew)
brew install elasticsearch
brew services start elasticsearch

# Ubuntu/Debian
# Follow instructions at https://www.elastic.co/guide/en/elasticsearch/reference/current/install-elasticsearch.html
```

### 4. Configure Environment Variables

Edit `services/api/.env` and `apps/web/.env` with your local database credentials and other settings.

### 5. Install Dependencies

```bash
npm install
```

### 6. Run Database Migrations

```bash
cd services/api
npm run build
# Migrations will run automatically when starting the app
```

### 7. Start Development Servers

In separate terminal windows:

```bash
# Terminal 1: Start API
cd services/api
npm run dev

# Terminal 2: Start Frontend
cd apps/web
npm run dev

# Terminal 3: Start Transcoder (optional)
cd services/transcoder
npm run dev

# Terminal 4: Start Recommender (optional)
cd services/recommender
npm run dev
```

## Configuration

### Database Configuration

PostgreSQL configuration in `services/api/.env`:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=anime_platform
```

### OAuth Configuration

#### Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URI: `http://localhost:3001/api/auth/google/callback`
6. Copy Client ID and Client Secret to `.env`:

```env
GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-client-secret
GOOGLE_CALLBACK_URL=http://localhost:3001/api/auth/google/callback
```

#### GitHub OAuth

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Create a new OAuth App
3. Set Authorization callback URL: `http://localhost:3001/api/auth/github/callback`
4. Copy Client ID and Client Secret to `.env`:

```env
GITHUB_CLIENT_ID=your-client-id
GITHUB_CLIENT_SECRET=your-client-secret
GITHUB_CALLBACK_URL=http://localhost:3001/api/auth/github/callback
```

### AWS Configuration

For video storage and CDN:

```env
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_S3_BUCKET=anime-platform-videos
AWS_CLOUDFRONT_DOMAIN=your-cloudfront-domain
```

### Stripe Configuration

For payment processing:

1. Create a [Stripe account](https://stripe.com/)
2. Get your API keys from the dashboard
3. Create products and prices for subscription plans
4. Add to `.env`:

```env
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_MONTHLY_PRICE_ID=price_...
STRIPE_YEARLY_PRICE_ID=price_...
```

## Development Workflow

### Running Tests

```bash
# Run all tests
npm test

# Run tests for specific service
cd services/api
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:cov
```

### Linting

```bash
# Lint all code
npm run lint

# Lint and fix
npm run lint:fix

# Format code
npm run format
```

### Building for Production

```bash
# Build all services
npm run build

# Build specific service
cd apps/web
npm run build
```

## Troubleshooting

### Port Already in Use

If you get "port already in use" errors:

```bash
# Find process using port
lsof -i :3000  # or :3001, :5432, etc.

# Kill the process
kill -9 <PID>
```

### Database Connection Issues

1. Verify PostgreSQL is running:
```bash
pg_isready
```

2. Check connection settings in `.env`
3. Ensure database exists:
```bash
psql -l | grep anime_platform
```

### Docker Issues

```bash
# Stop all containers
docker-compose down

# Remove volumes (WARNING: deletes data)
docker-compose down -v

# Rebuild images
docker-compose build --no-cache

# View logs
docker-compose logs -f [service-name]
```

### Node Module Issues

```bash
# Clear node modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Or use clean install
npm ci
```

## Next Steps

1. **Seed Sample Data**: Run the seeder script to populate the database with sample anime data
2. **Configure AWS**: Set up S3 bucket and CloudFront distribution for video streaming
3. **Set up OAuth**: Configure Google, GitHub, and Apple OAuth for authentication
4. **Configure Stripe**: Set up payment processing and subscription plans
5. **Customize**: Modify the UI, add features, and customize to your needs

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [NestJS Documentation](https://docs.nestjs.com/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Docker Documentation](https://docs.docker.com/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

## Support

If you encounter any issues:

1. Check the [Troubleshooting](#troubleshooting) section
2. Search existing GitHub issues
3. Create a new issue with detailed information
4. Join our community chat (if available)

## License

This project is licensed under the MIT License - see the [LICENSE](../LICENSE) file for details.
