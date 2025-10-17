# API Documentation

## Base URL

- **Development**: `http://localhost:3001/api`
- **Production**: `https://api.animeplatform.com/api`

## Authentication

All authenticated endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer <token>
```

## Endpoints

### Authentication

#### Register

Create a new user account.

```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securePassword123",
  "name": "John Doe"
}
```

**Response (201 Created)**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Login

Authenticate and receive access token.

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Response (200 OK)**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### OAuth - Google

```http
GET /api/auth/google
```

Redirects to Google OAuth consent screen.

#### OAuth - GitHub

```http
GET /api/auth/github
```

Redirects to GitHub OAuth authorization.

#### Get Profile

Get authenticated user's profile.

```http
GET /api/auth/profile
Authorization: Bearer <token>
```

**Response (200 OK)**
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "name": "John Doe",
  "role": "user",
  "emailVerified": true,
  "createdAt": "2024-01-01T00:00:00Z"
}
```

### Users

#### Get Current User

```http
GET /api/users/me
Authorization: Bearer <token>
```

**Response (200 OK)**
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "name": "John Doe",
  "avatarUrl": "https://...",
  "preferences": {}
}
```

#### Update Profile

```http
PUT /api/users/me
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Jane Doe",
  "avatarUrl": "https://..."
}
```

**Response (200 OK)**
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "name": "Jane Doe",
  "avatarUrl": "https://..."
}
```

### Anime

#### List Anime

Get paginated list of anime.

```http
GET /api/anime?page=1&limit=20
```

**Query Parameters**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20, max: 100)

**Response (200 OK)**
```json
[
  {
    "id": "uuid",
    "title": "Attack on Titan",
    "description": "Humanity fights for survival...",
    "thumbnailUrl": "https://...",
    "genres": ["Action", "Drama", "Fantasy"],
    "rating": 9.0,
    "episodeCount": 87,
    "status": "completed",
    "releaseYear": 2013
  }
]
```

#### Get Anime Details

```http
GET /api/anime/:id
```

**Response (200 OK)**
```json
{
  "id": "uuid",
  "title": "Attack on Titan",
  "description": "Humanity fights for survival...",
  "thumbnailUrl": "https://...",
  "bannerUrl": "https://...",
  "genres": ["Action", "Drama", "Fantasy"],
  "rating": 9.0,
  "episodeCount": 87,
  "status": "completed",
  "releaseYear": 2013,
  "studio": "Wit Studio",
  "createdAt": "2024-01-01T00:00:00Z"
}
```

#### Search Anime

```http
GET /api/anime/search?q=attack
```

**Query Parameters**
- `q` (required): Search query

**Response (200 OK)**
```json
[
  {
    "id": "uuid",
    "title": "Attack on Titan",
    "rating": 9.0
  }
]
```

#### Filter by Genre

```http
GET /api/anime/genre/:genre
```

**Response (200 OK)**
```json
[
  {
    "id": "uuid",
    "title": "My Hero Academia",
    "genres": ["Action", "Comedy", "School"]
  }
]
```

#### Create Anime (Admin)

```http
POST /api/anime
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "title": "New Anime",
  "description": "Description...",
  "genres": ["Action", "Adventure"],
  "rating": 8.5,
  "episodeCount": 24,
  "status": "ongoing",
  "releaseYear": 2024,
  "studio": "Studio Name"
}
```

**Response (201 Created)**
```json
{
  "id": "uuid",
  "title": "New Anime",
  ...
}
```

### Subscriptions

#### Get Subscription

Get user's current subscription.

```http
GET /api/subscriptions
Authorization: Bearer <token>
```

**Response (200 OK)**
```json
{
  "id": "uuid",
  "plan": "monthly",
  "status": "active",
  "currentPeriodStart": "2024-01-01T00:00:00Z",
  "currentPeriodEnd": "2024-02-01T00:00:00Z"
}
```

#### Create Subscription

```http
POST /api/subscriptions
Authorization: Bearer <token>
Content-Type: application/json

{
  "plan": "monthly",
  "paymentMethodId": "pm_card_..."
}
```

**Response (201 Created)**
```json
{
  "id": "uuid",
  "plan": "monthly",
  "status": "active"
}
```

#### Cancel Subscription

```http
DELETE /api/subscriptions
Authorization: Bearer <token>
```

**Response (200 OK)**
```json
{
  "id": "uuid",
  "status": "canceled",
  "canceledAt": "2024-01-15T00:00:00Z"
}
```

### Recommendations

#### Get Recommendations

```http
GET /api/recommender/recommendations/:userId?limit=10
```

**Response (200 OK)**
```json
{
  "userId": "uuid",
  "recommendations": ["anime-id-1", "anime-id-2", ...]
}
```

#### Get Trending

```http
GET /api/recommender/trending?limit=10
```

**Response (200 OK)**
```json
{
  "trending": ["anime-id-1", "anime-id-2", ...]
}
```

#### Get Similar Anime

```http
GET /api/recommender/similar/:animeId?limit=5
```

**Response (200 OK)**
```json
{
  "animeId": "uuid",
  "similar": ["anime-id-1", "anime-id-2", ...]
}
```

### Transcoding

#### Create Transcoding Job

```http
POST /api/transcoder/transcode
Content-Type: application/json

{
  "videoUrl": "s3://bucket/video.mp4",
  "animeId": "uuid",
  "episodeId": "uuid"
}
```

**Response (200 OK)**
```json
{
  "jobId": "job-uuid",
  "status": "queued"
}
```

#### Check Job Status

```http
GET /api/transcoder/status/:jobId
```

**Response (200 OK)**
```json
{
  "jobId": "job-uuid",
  "state": "completed",
  "progress": 100
}
```

## Error Responses

All endpoints may return the following error responses:

### 400 Bad Request

```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email format"
    }
  ]
}
```

### 401 Unauthorized

```json
{
  "statusCode": 401,
  "message": "Unauthorized"
}
```

### 403 Forbidden

```json
{
  "statusCode": 403,
  "message": "Forbidden resource"
}
```

### 404 Not Found

```json
{
  "statusCode": 404,
  "message": "Resource not found"
}
```

### 500 Internal Server Error

```json
{
  "statusCode": 500,
  "message": "Internal server error"
}
```

## Rate Limiting

- **Rate**: 100 requests per 15 minutes per IP
- **Headers**:
  - `X-RateLimit-Limit`: Request limit
  - `X-RateLimit-Remaining`: Remaining requests
  - `X-RateLimit-Reset`: Reset timestamp

## GraphQL API

GraphQL endpoint: `/graphql`

### Example Query

```graphql
query GetAnime($id: ID!) {
  anime(id: $id) {
    id
    title
    description
    rating
    genres
  }
}
```

### Example Mutation

```graphql
mutation CreateAnime($input: CreateAnimeInput!) {
  createAnime(input: $input) {
    id
    title
  }
}
```

## Webhooks

### Stripe Webhook

```http
POST /api/webhooks/stripe
Content-Type: application/json
Stripe-Signature: <signature>

{
  "type": "invoice.payment_succeeded",
  "data": { ... }
}
```

## SDK Examples

### JavaScript/TypeScript

```typescript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3001/api',
});

// Login
const { data } = await api.post('/auth/login', {
  email: 'user@example.com',
  password: 'password',
});

// Set token for authenticated requests
api.defaults.headers.common['Authorization'] = `Bearer ${data.accessToken}`;

// Get anime
const anime = await api.get('/anime');
```

### cURL

```bash
# Login
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password"}'

# Get anime (with auth)
curl http://localhost:3001/api/anime \
  -H "Authorization: Bearer <token>"
```

## Postman Collection

Import the Postman collection for easy API testing:

```bash
# Coming soon
```

## OpenAPI/Swagger

Interactive API documentation available at:
- Development: `http://localhost:3001/api`
- Production: `https://api.animeplatform.com/api`
