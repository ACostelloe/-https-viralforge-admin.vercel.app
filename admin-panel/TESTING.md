# ViralForge Admin Panel - Testing Guide

## Overview

This document provides comprehensive information about testing the ViralForge Admin Panel. We use a multi-layered testing approach including unit tests, integration tests, and end-to-end tests.

## Testing Stack

- **Unit Tests**: Jest + React Testing Library
- **Integration Tests**: Jest + MSW (Mock Service Worker)
- **E2E Tests**: Cypress
- **Coverage**: Jest Coverage Reports
- **CI/CD**: GitHub Actions with automated testing

## Quick Start

```bash
# Install dependencies
npm install

# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run E2E tests (requires dev server running)
npm run test:e2e

# Run integration tests
npm run test:integration
```

## Test Structure

```
src/
├── components/
│   ├── __tests__/
│   │   ├── Button.test.tsx
│   │   ├── MetricCard.test.tsx
│   │   └── Sidebar.test.tsx
│   └── ...
├── pages/
│   ├── __tests__/
│   │   ├── Dashboard.test.tsx
│   │   └── ...
│   └── ...
├── services/
│   ├── __tests__/
│   │   ├── api.test.ts
│   │   └── ...
│   └── ...
├── store/
│   ├── __tests__/
│   │   └── store.test.ts
│   └── ...
└── test/
    ├── setup.ts
    ├── utils.tsx
    └── mocks/
        ├── server.ts
        └── handlers.ts

cypress/
├── e2e/
│   ├── dashboard.cy.ts
│   ├── content.cy.ts
│   └── accounts.cy.ts
├── fixtures/
│   ├── metrics.json
│   └── accounts.json
└── support/
    ├── commands.ts
    └── e2e.ts
```

## Unit Testing

### Component Testing

We test React components using React Testing Library with a focus on user interactions and accessibility.

```typescript
// Example: Button.test.tsx
import { render, screen, fireEvent } from '../test/utils';
import { Button } from '../Button';

describe('Button Component', () => {
  it('renders with correct text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
  });

  it('handles click events', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Clickable</Button>);
    
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

### Service Testing

API services are tested with mocked HTTP requests.

```typescript
// Example: api.test.ts
import { ApiService } from '../api';
import { server } from '../../test/mocks/server';

describe('ApiService', () => {
  it('fetches dashboard metrics', async () => {
    const metrics = await ApiService.getDashboardMetrics();
    expect(metrics.totalPosts).toBe(1247);
  });
});
```

### Store Testing

Zustand stores are tested for state management logic.

```typescript
// Example: store.test.ts
import { useAppStore } from '../store';

describe('App Store', () => {
  it('updates metrics correctly', () => {
    const { setMetrics, metrics } = useAppStore.getState();
    const newMetrics = { totalPosts: 100, activeAccounts: 5 };
    
    setMetrics(newMetrics);
    expect(useAppStore.getState().metrics).toEqual(newMetrics);
  });
});
```

## Integration Testing

Integration tests use MSW to mock API responses and test component interactions with real data flow.

### MSW Setup

Mock Service Worker intercepts HTTP requests during tests:

```typescript
// test/mocks/handlers.ts
import { http, HttpResponse } from 'msw';

export const handlers = [
  http.get('/api/dashboard/metrics', () => {
    return HttpResponse.json({
      totalPosts: 1247,
      activeAccounts: 23,
      scheduledPosts: 156,
      engagementRate: 8.4
    });
  }),
];
```

### Integration Test Example

```typescript
// Dashboard.integration.test.tsx
import { render, screen, waitFor } from '../test/utils';
import { Dashboard } from '../Dashboard';

describe('Dashboard Integration', () => {
  it('loads and displays metrics from API', async () => {
    render(<Dashboard />);
    
    await waitFor(() => {
      expect(screen.getByText('1,247')).toBeInTheDocument();
      expect(screen.getByText('23')).toBeInTheDocument();
    });
  });
});
```

## End-to-End Testing

E2E tests use Cypress to test complete user workflows.

### Running E2E Tests

```bash
# Start dev server
npm run dev

# In another terminal, run E2E tests
npm run test:e2e

# Or run interactively
npm run test:e2e:open
```

### E2E Test Example

```typescript
// cypress/e2e/dashboard.cy.ts
describe('Dashboard E2E', () => {
  it('should display dashboard and navigate', () => {
    cy.visit('/');
    cy.get('[data-testid="metric-card"]').should('have.length', 4);
    
    cy.get('[data-testid="nav-content"]').click();
    cy.url().should('include', '/content');
  });
});
```

## Test Data Management

### Fixtures

Test data is stored in fixtures for consistency:

```json
// cypress/fixtures/metrics.json
{
  "totalPosts": 1247,
  "activeAccounts": 23,
  "scheduledPosts": 156,
  "engagementRate": 8.4
}
```

### Factory Functions

Use factory functions for generating test data:

```typescript
// test/factories.ts
export const createMockMetrics = (overrides = {}) => ({
  totalPosts: 1000,
  activeAccounts: 10,
  scheduledPosts: 50,
  engagementRate: 5.0,
  ...overrides
});
```

## Coverage Requirements

We maintain high test coverage standards:

- **Branches**: 80%
- **Functions**: 80%
- **Lines**: 80%
- **Statements**: 80%

### Viewing Coverage

```bash
# Generate coverage report
npm run test:coverage

# Open coverage report in browser
open coverage/lcov-report/index.html
```

## Testing Best Practices

### 1. Test Structure (AAA Pattern)

```typescript
it('should update user profile', async () => {
  // Arrange
  const user = createMockUser();
  const updatedData = { name: 'New Name' };
  
  // Act
  render(<UserProfile user={user} />);
  fireEvent.change(screen.getByLabelText(/name/i), {
    target: { value: updatedData.name }
  });
  fireEvent.click(screen.getByRole('button', { name: /save/i }));
  
  // Assert
  await waitFor(() => {
    expect(screen.getByText('Profile updated')).toBeInTheDocument();
  });
});
```

### 2. Test Naming

Use descriptive test names that explain the scenario:

```typescript
// Good
it('should display error message when API request fails')
it('should disable submit button when form is invalid')

// Bad
it('should work')
it('test button')
```

### 3. Data Test IDs

Use `data-testid` attributes for reliable element selection:

```tsx
<button data-testid="submit-button">Submit</button>
```

### 4. Async Testing

Always use proper async utilities:

```typescript
// Good
await waitFor(() => {
  expect(screen.getByText('Loaded')).toBeInTheDocument();
});

// Bad
setTimeout(() => {
  expect(screen.getByText('Loaded')).toBeInTheDocument();
}, 1000);
```

### 5. Mock External Dependencies

Mock external services and APIs:

```typescript
jest.mock('../services/api', () => ({
  ApiService: {
    getDashboardMetrics: jest.fn().mockResolvedValue(mockMetrics),
  },
}));
```

## Continuous Integration

### GitHub Actions

Tests run automatically on every PR and push:

```yaml
# .github/workflows/test.yml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run test:ci
      - run: npm run build
```

### Pre-commit Hooks

Use Husky for pre-commit testing:

```json
{
  "husky": {
    "hooks": {
      "pre-commit": "npm run test:ci && npm run lint"
    }
  }
}
```

## Debugging Tests

### Jest Debugging

```bash
# Debug specific test
npm test -- --testNamePattern="Button Component"

# Run tests in debug mode
node --inspect-brk node_modules/.bin/jest --runInBand
```

### Cypress Debugging

```typescript
// Add debugging commands
cy.debug();
cy.pause();
cy.screenshot('debug-screenshot');
```

## Performance Testing

### Bundle Analysis

```bash
npm run analyze
```

### Lighthouse CI

```bash
npm install -g @lhci/cli
lhci autorun
```

## Accessibility Testing

### Jest-axe

```typescript
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

it('should not have accessibility violations', async () => {
  const { container } = render(<Dashboard />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

### Cypress-axe

```typescript
// cypress/support/commands.ts
import 'cypress-axe';

// In test
cy.injectAxe();
cy.checkA11y();
```

## Troubleshooting

### Common Issues

1. **Tests timing out**: Increase timeout or check for unresolved promises
2. **Mock not working**: Ensure mocks are properly configured in setup
3. **DOM not updating**: Use `waitFor` for async updates
4. **Cypress flaky tests**: Add proper waits and assertions

### Debug Commands

```bash
# Clear Jest cache
npm test -- --clearCache

# Run specific test file
npm test Button.test.tsx

# Run tests with verbose output
npm test -- --verbose
```

## Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Cypress Documentation](https://docs.cypress.io/)
- [MSW Documentation](https://mswjs.io/docs/)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

## Contributing

When adding new features:

1. Write tests first (TDD approach)
2. Ensure all tests pass
3. Maintain coverage thresholds
4. Update this documentation if needed
5. Add E2E tests for critical user flows

For questions or issues with testing, please create an issue in the repository. 