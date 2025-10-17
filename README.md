# Anime Streaming Platform 🎬

A professional, production-ready anime streaming platform similar to Netflix, built with modern technologies and best practices.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-18.x-green.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)

## 🌟 Features

### Core Functionality
- **🎥 HLS Video Streaming** - Adaptive bitrate streaming with multiple quality options
- **🔐 Authentication** - JWT + OAuth (Google, GitHub, Apple) with email verification
- **💳 Subscriptions** - Stripe integration for monthly, yearly, and trial plans
- **🔍 Search** - Elasticsearch-powered search with filters and autocomplete
- **🤖 Recommendations** - Collaborative filtering recommendation engine
- **👥 Multi-Profile** - Multiple user profiles with parental controls
- **📱 Cross-Platform** - React Native mobile app scaffold included
- **🌍 Multi-Language** - Internationalization support for UI and subtitles

### Video Player Features
- Adaptive HLS streaming
- Multi-quality selection (auto, 1080p, 720p, 480p)
- Subtitle support (VTT format)
- Multi-audio tracks
- Picture-in-Picture mode
- Fullscreen support
- Playback speed control
- Keyboard shortcuts
- Continue watching functionality
- Error recovery

### Security Features
- OWASP best practices compliance
- Input validation and sanitization
- CSRF protection
- XSS prevention
- CSP headers
- HTTPS enforcement
- HSTS enabled
- Rate limiting
- Secure cookies (SameSite, HttpOnly)
- Encrypted sensitive data
- Secret management via environment variables

## 🏗️ Architecture

```
anime-streaming-platform/
├── apps/
│   ├── web/                 # Next.js frontend (App Router)
│   └── mobile/              # React Native (Expo) mobile app
├── services/
│   ├── api/                 # NestJS backend API
│   ├── transcoder/          # FFmpeg HLS transcoding service
│   └── recommender/         # Recommendation microservice
├── packages/
│   └── ui/                  # Shared UI components
├── infrastructure/
│   ├── terraform/           # Infrastructure as Code
│   └── kubernetes/          # K8s manifests
├── scripts/                 # Utility scripts
└── .github/
    └── workflows/           # CI/CD pipelines
```

## 🚀 Tech Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Forms**: React Hook Form + Zod
- **Video Player**: HLS.js (custom player)

### Backend
- **Framework**: NestJS
- **Language**: TypeScript
- **APIs**: REST + GraphQL (Apollo)
- **Database**: PostgreSQL with TypeORM
- **Cache**: Redis
- **Search**: Elasticsearch
- **Authentication**: JWT + Passport.js
- **Payments**: Stripe

### Infrastructure
- **Cloud**: AWS (S3, CloudFront, ECS)
- **Containers**: Docker + Docker Compose
- **Orchestration**: Kubernetes
- **IaC**: Terraform
- **CI/CD**: GitHub Actions
- **Monitoring**: Prometheus + Grafana
- **Error Tracking**: Sentry

## 📦 Installation

### Prerequisites
- Node.js 18+
- Docker & Docker Compose
- PostgreSQL 15+
- Redis 7+
- Elasticsearch 8+ (optional)

### Quick Start with Docker

1. **Clone the repository**
```bash
git clone https://github.com/Shivam-3690115/anime-striming-plateform.git
cd anime-striming-plateform
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
# Copy example env files
cp services/api/.env.example services/api/.env
cp apps/web/.env.example apps/web/.env

# Edit the files and add your configuration
```

4. **Start services with Docker Compose**
```bash
docker-compose up -d
```

5. **Access the application**
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001
- API Documentation: http://localhost:3001/api

### Development Setup

1. **Start infrastructure services**
```bash
docker-compose up -d postgres redis elasticsearch
```

2. **Install dependencies**
```bash
npm install
```

3. **Run database migrations**
```bash
cd services/api
npm run migration:run
```

4. **Start development servers**
```bash
# In the root directory
npm run dev

# Or individually
cd apps/web && npm run dev        # Frontend
cd services/api && npm run dev    # Backend
```

## 🧪 Testing

### Run all tests
```bash
npm test
```

### Run specific test suites
```bash
# Unit tests
npm run test:unit

# Integration tests
npm run test:integration

# E2E tests
npm run test:e2e

# Coverage
npm run test:cov
```

## 📝 Environment Variables

### Backend (services/api/.env)
See `services/api/.env.example` for all required variables:
- Database configuration
- Redis configuration
- JWT secrets
- OAuth credentials (Google, GitHub, Apple)
- AWS credentials (S3, CloudFront)
- Stripe API keys
- SMTP settings

### Frontend (apps/web/.env)
See `apps/web/.env.example` for required variables:
- API URL
- Stripe publishable key

## 🔒 Security

This platform implements comprehensive security measures:

- ✅ Input validation with class-validator
- ✅ SQL injection prevention via ORM
- ✅ XSS protection with CSP headers
- ✅ CSRF tokens for state-changing operations
- ✅ Rate limiting to prevent abuse
- ✅ Secure password hashing with bcrypt
- ✅ JWT token authentication
- ✅ HTTPS enforcement
- ✅ HSTS headers
- ✅ Secure cookie configuration
- ✅ OAuth 2.0 for third-party authentication
- ✅ Environment-based secret management

## 📊 API Documentation

API documentation is automatically generated using Swagger/OpenAPI:

- **Swagger UI**: http://localhost:3001/api
- **OpenAPI JSON**: http://localhost:3001/api-json

### Key Endpoints

**Authentication**
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `GET /api/auth/google` - Google OAuth
- `GET /api/auth/github` - GitHub OAuth

**Anime**
- `GET /api/anime` - List all anime
- `GET /api/anime/:id` - Get anime details
- `GET /api/anime/search?q=` - Search anime
- `POST /api/anime` - Create anime (admin)

**Subscriptions**
- `GET /api/subscriptions` - Get user subscription
- `POST /api/subscriptions` - Create subscription
- `DELETE /api/subscriptions` - Cancel subscription

## 🚢 Deployment

### Docker Deployment

```bash
# Build production images
docker-compose -f docker-compose.prod.yml build

# Deploy
docker-compose -f docker-compose.prod.yml up -d
```

### Kubernetes Deployment

```bash
# Apply configurations
kubectl apply -f infrastructure/kubernetes/

# Or use Helm
helm install anime-platform ./infrastructure/helm
```

### AWS Deployment with Terraform

```bash
cd infrastructure/terraform
terraform init
terraform plan
terraform apply
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## ⚖️ Legal & Compliance

### Content Licensing
This platform is designed to stream legally licensed anime content. Ensure you have proper licensing agreements before uploading any content.

### DMCA Compliance
We respect intellectual property rights. If you believe content infringes your copyright, please contact us.

### Data Protection
This platform implements GDPR-compliant data handling practices:
- User data encryption
- Right to erasure
- Data portability
- Privacy by design

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- NestJS team for the backend framework
- All open-source contributors

## 📧 Support

For support, email support@animeplatform.com or open an issue on GitHub.

---

**Note**: This is a starter template. Replace placeholder values in `.env.example` files with your actual credentials before deploying to production.
