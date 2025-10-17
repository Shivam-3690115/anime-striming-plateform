# Contributing to Anime Streaming Platform

Thank you for your interest in contributing! This document provides guidelines and instructions for contributing to the project.

## Code of Conduct

By participating in this project, you agree to abide by our Code of Conduct:

- Be respectful and inclusive
- Accept constructive criticism gracefully
- Focus on what is best for the community
- Show empathy towards others

## How to Contribute

### Reporting Bugs

Before creating a bug report:

1. **Check existing issues** to avoid duplicates
2. **Use the latest version** to ensure the bug hasn't been fixed
3. **Collect information** about your environment

When creating a bug report, include:

- **Clear title and description**
- **Steps to reproduce** the issue
- **Expected vs actual behavior**
- **Screenshots** if applicable
- **Environment details** (OS, Node version, browser, etc.)
- **Error messages** and stack traces

### Suggesting Features

Feature requests are welcome! Please:

1. **Check existing issues** for similar requests
2. **Provide clear use cases** for the feature
3. **Explain why** this feature would be useful
4. **Consider the scope** - is it aligned with project goals?

### Pull Requests

#### Before You Start

1. **Fork the repository** and create your branch from `main`
2. **Check existing PRs** to avoid duplicate work
3. **Discuss major changes** in an issue first

#### Development Process

1. **Set up your development environment**
   ```bash
   git clone https://github.com/YOUR-USERNAME/anime-striming-plateform.git
   cd anime-striming-plateform
   npm install
   ```

2. **Create a new branch**
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/your-bug-fix
   ```

3. **Make your changes**
   - Follow the [coding standards](#coding-standards)
   - Write or update tests
   - Update documentation

4. **Test your changes**
   ```bash
   npm test
   npm run lint
   npm run build
   ```

5. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: add new feature"
   ```
   
   Follow [Conventional Commits](https://www.conventionalcommits.org/):
   - `feat:` new feature
   - `fix:` bug fix
   - `docs:` documentation changes
   - `style:` formatting changes
   - `refactor:` code refactoring
   - `test:` adding tests
   - `chore:` maintenance tasks

6. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

7. **Create a Pull Request**
   - Use a clear title and description
   - Reference related issues
   - Include screenshots for UI changes
   - List breaking changes if any

#### PR Requirements

- [ ] Code follows project style guidelines
- [ ] Tests pass (`npm test`)
- [ ] Linting passes (`npm run lint`)
- [ ] Build succeeds (`npm run build`)
- [ ] Documentation is updated
- [ ] Commits follow conventional commits
- [ ] PR description is clear and complete

## Coding Standards

### General Guidelines

- **Write clean, readable code**
- **Follow DRY principle** (Don't Repeat Yourself)
- **Keep functions small and focused**
- **Use meaningful variable names**
- **Comment complex logic**
- **Handle errors properly**

### TypeScript

```typescript
// ✅ Good
interface User {
  id: string;
  email: string;
  name: string;
}

function getUserById(id: string): Promise<User> {
  // Implementation
}

// ❌ Bad
function get(x: any): any {
  // Implementation
}
```

### React/Next.js

```tsx
// ✅ Good - Functional component with TypeScript
interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
}

export function Button({ label, onClick, variant = 'primary' }: ButtonProps) {
  return (
    <button onClick={onClick} className={`btn-${variant}`}>
      {label}
    </button>
  );
}

// ❌ Bad - No types, unclear props
export function Button(props) {
  return <button onClick={props.click}>{props.text}</button>;
}
```

### NestJS

```typescript
// ✅ Good - Proper service structure
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findById(id: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }
}

// ❌ Bad - No error handling, unclear return type
@Injectable()
export class UserService {
  async getUser(id) {
    return await this.repo.find(id);
  }
}
```

### File Naming

- **Components**: PascalCase - `UserProfile.tsx`
- **Utilities**: camelCase - `formatDate.ts`
- **Constants**: UPPER_SNAKE_CASE - `API_ENDPOINTS.ts`
- **CSS/SCSS**: kebab-case - `user-profile.module.css`

### Code Organization

```
src/
├── components/        # React components
│   ├── common/       # Reusable components
│   └── features/     # Feature-specific components
├── hooks/            # Custom React hooks
├── lib/              # Utility functions
├── types/            # TypeScript types/interfaces
└── app/              # Next.js app directory
```

## Testing Guidelines

### Unit Tests

```typescript
// ✅ Good - Clear, isolated test
describe('UserService', () => {
  it('should find user by id', async () => {
    const mockUser = { id: '1', email: 'test@example.com' };
    const service = new UserService(mockRepository);
    
    const result = await service.findById('1');
    
    expect(result).toEqual(mockUser);
  });
});
```

### Integration Tests

- Test API endpoints end-to-end
- Use test database
- Clean up after each test

### E2E Tests

- Test critical user flows
- Use Playwright or Cypress
- Run on CI/CD pipeline

## Documentation

### Code Comments

```typescript
// ✅ Good - Explains WHY
// Use exponential backoff to avoid overwhelming the API
// during high traffic periods
await retry(apiCall, { backoff: 'exponential' });

// ❌ Bad - Explains WHAT (obvious from code)
// Call the API
await apiCall();
```

### JSDoc for Public APIs

```typescript
/**
 * Fetches user data from the database
 * @param id - The user's unique identifier
 * @returns Promise resolving to User object
 * @throws {NotFoundException} When user is not found
 */
async function getUserById(id: string): Promise<User> {
  // Implementation
}
```

### README Updates

- Update README.md if you add features
- Include usage examples
- Document configuration options
- List dependencies

## Git Workflow

### Branch Naming

- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation
- `refactor/` - Code refactoring
- `test/` - Test additions/changes

Examples:
- `feature/user-authentication`
- `fix/video-player-controls`
- `docs/api-documentation`

### Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>[optional scope]: <description>

[optional body]

[optional footer]
```

Examples:
```
feat(auth): add Google OAuth integration

fix(player): resolve playback issues on Safari

docs(readme): update installation instructions

refactor(api): simplify user service logic
```

## Review Process

### For Contributors

- Respond to feedback promptly
- Make requested changes
- Keep PR scope focused
- Be patient and respectful

### For Reviewers

- Review promptly (within 48 hours)
- Be constructive and respectful
- Explain reasoning for requested changes
- Approve when requirements are met

## Getting Help

- **Documentation**: Check the `/docs` folder
- **Issues**: Search existing issues or create new one
- **Discussions**: Use GitHub Discussions for questions
- **Discord**: Join our community server (if available)

## Recognition

Contributors will be:
- Listed in CONTRIBUTORS.md
- Mentioned in release notes
- Given credit in relevant documentation

Thank you for contributing to make this project better! 🎉
