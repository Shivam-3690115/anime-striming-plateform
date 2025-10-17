# Testing Guide

## Overview

This guide covers testing strategies, tools, and best practices for the Anime Streaming Platform.

## Testing Stack

- **Unit Testing**: Jest
- **Integration Testing**: Jest with Supertest
- **E2E Testing**: Playwright
- **Component Testing**: React Testing Library
- **Mobile Testing**: Jest with React Native Testing Library

## Running Tests

### All Tests

```bash
# Run all tests across all packages
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:cov
```

### Service-Specific Tests

```bash
# API tests
cd services/api
npm test

# Frontend tests
cd apps/web
npm test

# Mobile tests
cd apps/mobile
npm test
```

## Unit Testing

### Backend (NestJS)

```typescript
// services/api/src/auth/auth.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../user/user.entity';
import { JwtService } from '@nestjs/jwt';

describe('AuthService', () => {
  let service: AuthService;

  const mockUserRepository = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(() => 'test-token'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('login', () => {
    it('should return access token for valid credentials', async () => {
      const mockUser = {
        id: '1',
        email: 'test@example.com',
        password: '$2b$10$hashedpassword',
      };

      mockUserRepository.findOne.mockResolvedValue(mockUser);
      jest.spyOn(require('bcrypt'), 'compare').mockResolvedValue(true);

      const result = await service.login('test@example.com', 'password');

      expect(result).toHaveProperty('accessToken');
      expect(result.accessToken).toBe('test-token');
    });

    it('should throw error for invalid credentials', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(
        service.login('test@example.com', 'wrong-password')
      ).rejects.toThrow('Invalid credentials');
    });
  });
});
```

### Frontend (React)

```typescript
// apps/web/src/components/__tests__/Button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '@anime-platform/ui';

describe('Button', () => {
  it('renders button with text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    fireEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('applies correct variant styles', () => {
    const { container } = render(
      <Button variant="primary">Primary</Button>
    );
    
    const button = container.querySelector('button');
    expect(button).toHaveClass('bg-red-600');
  });
});
```

## Integration Testing

### API Integration Tests

```typescript
// services/api/test/auth.e2e-spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('AuthController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/api/auth/register (POST)', () => {
    it('should register a new user', () => {
      return request(app.getHttpServer())
        .post('/api/auth/register')
        .send({
          email: 'test@example.com',
          password: 'password123',
          name: 'Test User',
        })
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('accessToken');
        });
    });

    it('should return 400 for invalid email', () => {
      return request(app.getHttpServer())
        .post('/api/auth/register')
        .send({
          email: 'invalid-email',
          password: 'password123',
          name: 'Test User',
        })
        .expect(400);
    });
  });

  describe('/api/auth/login (POST)', () => {
    it('should login with valid credentials', () => {
      return request(app.getHttpServer())
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'password123',
        })
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('accessToken');
        });
    });
  });
});
```

## E2E Testing

### Playwright Setup

```typescript
// apps/web/e2e/auth.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test('should login successfully', async ({ page }) => {
    await page.goto('http://localhost:3000/login');

    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');

    await expect(page).toHaveURL('http://localhost:3000/browse');
  });

  test('should show error for invalid credentials', async ({ page }) => {
    await page.goto('http://localhost:3000/login');

    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'wrongpassword');
    await page.click('button[type="submit"]');

    await expect(page.locator('.error-message')).toBeVisible();
  });
});

test.describe('Video Player', () => {
  test('should play video', async ({ page }) => {
    await page.goto('http://localhost:3000/anime/1');

    await page.click('[data-testid="play-button"]');
    
    const video = page.locator('video');
    await expect(video).toHaveJSProperty('paused', false);
  });
});
```

## Testing Best Practices

### 1. Test Structure (AAA Pattern)

```typescript
describe('Component/Feature', () => {
  it('should do something', () => {
    // Arrange - Set up test data and dependencies
    const input = 'test data';
    
    // Act - Execute the code being tested
    const result = functionToTest(input);
    
    // Assert - Verify the results
    expect(result).toBe('expected output');
  });
});
```

### 2. Test Coverage Goals

- **Critical Paths**: 100% coverage
- **Business Logic**: 90%+ coverage
- **Utility Functions**: 80%+ coverage
- **UI Components**: 70%+ coverage

### 3. What to Test

✅ **Do Test:**
- Business logic
- Edge cases
- Error handling
- User interactions
- API contracts
- Database operations
- Authentication/Authorization

❌ **Don't Test:**
- Third-party libraries
- Framework internals
- Simple getters/setters
- Constants

### 4. Test Data Management

```typescript
// Use factories for test data
const createMockUser = (overrides = {}) => ({
  id: '1',
  email: 'test@example.com',
  name: 'Test User',
  ...overrides,
});

const createMockAnime = (overrides = {}) => ({
  id: '1',
  title: 'Test Anime',
  rating: 8.5,
  ...overrides,
});
```

### 5. Mocking

```typescript
// Mock external dependencies
jest.mock('axios');

// Mock modules
jest.mock('../services/api', () => ({
  fetchAnime: jest.fn(() => Promise.resolve(mockAnime)),
}));

// Spy on functions
const spy = jest.spyOn(service, 'method');
expect(spy).toHaveBeenCalled();
```

## Continuous Integration

### GitHub Actions Test Workflow

Tests run automatically on:
- Every push to main/develop
- Every pull request
- Nightly builds

```yaml
# .github/workflows/ci-cd.yml
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
      - name: Install dependencies
        run: npm ci
      - name: Run tests
        run: npm test
      - name: Upload coverage
        uses: codecov/codecov-action@v3
```

## Performance Testing

### Load Testing with k6

```javascript
// scripts/load-test.js
import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
  vus: 100, // 100 virtual users
  duration: '30s',
};

export default function () {
  let response = http.get('http://localhost:3001/api/anime');
  
  check(response, {
    'status is 200': (r) => r.status === 200,
    'response time < 500ms': (r) => r.timings.duration < 500,
  });
  
  sleep(1);
}
```

## Security Testing

### OWASP ZAP Integration

```bash
# Run security scan
docker run -v $(pwd):/zap/wrk/:rw \
  -t owasp/zap2docker-stable zap-baseline.py \
  -t http://localhost:3000 \
  -r security-report.html
```

## Mobile Testing

### React Native Testing

```typescript
// apps/mobile/src/screens/__tests__/LoginScreen.test.tsx
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import LoginScreen from '../LoginScreen';

describe('LoginScreen', () => {
  it('should submit form with valid inputs', async () => {
    const navigation = { replace: jest.fn() };
    const { getByPlaceholderText, getByText } = render(
      <LoginScreen navigation={navigation} />
    );

    fireEvent.changeText(
      getByPlaceholderText('Email'),
      'test@example.com'
    );
    fireEvent.changeText(
      getByPlaceholderText('Password'),
      'password123'
    );
    fireEvent.press(getByText('Sign In'));

    await waitFor(() => {
      expect(navigation.replace).toHaveBeenCalledWith('Home');
    });
  });
});
```

## Test Reports

### Viewing Coverage Reports

```bash
# Generate coverage report
npm run test:cov

# Open HTML report
open coverage/lcov-report/index.html
```

### CI/CD Integration

- Coverage reports are uploaded to Codecov
- Test results are displayed in PR checks
- Failing tests block merges

## Troubleshooting

### Common Issues

1. **Tests timeout**
   - Increase timeout: `jest.setTimeout(10000)`
   - Check for async operations without await

2. **Module not found**
   - Clear Jest cache: `jest --clearCache`
   - Check tsconfig paths

3. **Flaky tests**
   - Add proper waits for async operations
   - Avoid depending on timing
   - Use `waitFor` instead of fixed delays

## Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Playwright Documentation](https://playwright.dev/)
- [NestJS Testing](https://docs.nestjs.com/fundamentals/testing)
