# Contributing to fhEVM SDK

Thank you for your interest in contributing! This document provides guidelines for contributing to the fhEVM SDK project.

## Getting Started

### Prerequisites

- Node.js ≥ 18.0.0
- npm ≥ 9.0.0
- Git

### Setup

```bash
# Fork and clone the repository
git clone https://github.com/your-username/fhevm-react-template.git
cd fhevm-react-template

# Install dependencies
npm run install:all

# Build SDK
npm run build:sdk

# Run tests
npm test
```

## Development Workflow

### 1. Create a Branch

```bash
git checkout -b feature/your-feature-name
```

Branch naming conventions:
- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation updates
- `refactor/` - Code refactoring
- `test/` - Test additions/modifications

### 2. Make Changes

- Write clear, concise code
- Follow existing code style
- Add tests for new features
- Update documentation

### 3. Test Your Changes

```bash
# Run SDK tests
cd packages/fhevm-sdk
npm test

# Build SDK
npm run build

# Test Next.js example
cd ../../examples/nextjs-privacy-dashboard
npm run build

# Test contract example
cd ../privacy-regulatory-reporting
npm run compile
npm test
```

### 4. Commit Your Changes

Use conventional commit messages:

```bash
git commit -m "feat: add batch encryption support"
git commit -m "fix: resolve decryption signature issue"
git commit -m "docs: update SDK README with examples"
```

### 5. Push and Create PR

```bash
git push origin feature/your-feature-name
```

Then create a Pull Request on GitHub with:
- Clear title and description
- Reference to related issues
- Screenshots/examples if applicable

## Code Style

### TypeScript

- Use TypeScript for all new code
- Provide type definitions for all exports
- Avoid `any` types when possible
- Use interfaces over types for objects

### Formatting

We use Prettier for code formatting:

```bash
npm run format
```

### Linting

```bash
npm run lint
```

## Testing

### SDK Tests

```bash
cd packages/fhevm-sdk
npm test
```

### Writing Tests

- Use Jest for unit tests
- Aim for 80%+ coverage
- Test both success and error cases
- Mock external dependencies

Example:
```typescript
import { createFhevmClient } from '../src';

describe('createFhevmClient', () => {
  it('should create client with valid config', async () => {
    const client = await createFhevmClient({ provider, signer });
    expect(client).toBeDefined();
  });

  it('should throw error with invalid config', async () => {
    await expect(createFhevmClient(null)).rejects.toThrow();
  });
});
```

## Documentation

### SDK Documentation

Update `packages/fhevm-sdk/README.md` for:
- New features
- API changes
- Usage examples

### Code Comments

```typescript
/**
 * Encrypt a value using FHE
 * @param value - Value to encrypt
 * @param type - Data type
 * @returns Encrypted result
 * @throws {EncryptionError} If encryption fails
 */
export async function encrypt(value: number, type: string): Promise<EncryptionResult> {
  // Implementation
}
```

## Pull Request Process

1. **Update Documentation** - Ensure README and docs are updated
2. **Add Tests** - Include tests for new features
3. **Pass CI** - All checks must pass
4. **Get Review** - At least one approval required
5. **Squash Commits** - Use squash merge for clean history

## Reporting Issues

### Bug Reports

Include:
- SDK version
- Environment (Node.js version, OS)
- Steps to reproduce
- Expected vs actual behavior
- Error messages/stack traces

### Feature Requests

Include:
- Use case description
- Proposed API/implementation
- Alternative solutions considered

## Code of Conduct

### Our Standards

- Be respectful and inclusive
- Provide constructive feedback
- Focus on what's best for the project
- Show empathy towards others

### Unacceptable Behavior

- Harassment or discrimination
- Trolling or insulting comments
- Publishing private information
- Unprofessional conduct

## Questions?

- Open an issue for questions
- Join our Discord community
- Email: support@example.com

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
