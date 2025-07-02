# Contributing to UmiKarma Frontend

Thank you for your interest in contributing to UmiKarma! This guide will help you get started with frontend development for our AI-Enhanced Reputation System.

## Table of Contents
- [Development Setup](#development-setup)
- [Code Style Guidelines](#code-style-guidelines)
- [Component Architecture](#component-architecture)
- [Testing](#testing)
- [Pull Request Process](#pull-request-process)
- [Issue Reporting](#issue-reporting)

## Development Setup

### Prerequisites
- Node.js 18+ and npm
- Git
- Modern web browser (Chrome, Firefox, Safari, Edge)
- (Optional) React Developer Tools browser extension

### Quick Start

1. **Fork and clone the repository**:
   ```bash
   git clone https://github.com/your-username/umikarma-frontend.git
   cd umikarma-frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

4. **Start development server**:
   ```bash
   npm start
   ```

5. **Verify setup**:
   - Visit `http://localhost:3000`
   - You should see the UmiKarma welcome screen

### Environment Variables

Create `.env.local` with:

```bash
# Backend API
REACT_APP_API_BASE_URL=http://localhost:3001
REACT_APP_API_TIMEOUT=10000

# Web3 Configuration
REACT_APP_WALLETCONNECT_PROJECT_ID=your_project_id

# GitHub OAuth (Optional)
REACT_APP_GITHUB_CLIENT_ID=your_github_client_id

# Development
REACT_APP_DEBUG=true
REACT_APP_MOCK_DATA=false
```

## Code Style Guidelines

### TypeScript Standards
- Use TypeScript for all new components and utilities
- Define interfaces for all props and data structures
- Prefer `interface` over `type` for component props
- Use proper type annotations for function parameters and return values

### React Component Standards

```typescript
// ✅ Good - Functional component with proper typing
interface UserProfileProps {
  user: UserData;
  onUpdate: (user: UserData) => void;
  className?: string;
}

export const UserProfile: React.FC<UserProfileProps> = ({ 
  user, 
  onUpdate, 
  className = '' 
}) => {
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = useCallback((updatedUser: UserData) => {
    onUpdate(updatedUser);
    setIsEditing(false);
  }, [onUpdate]);

  return (
    <div className={`clean-card ${className}`}>
      {/* Component content */}
    </div>
  );
};

// ❌ Bad - Missing types and proper structure
const UserProfile = ({ user, onUpdate }) => {
  const [editing, setEditing] = useState(false);
  
  return (
    <div>
      {/* Component content */}
    </div>
  );
};
```

### Naming Conventions
- **Components**: `PascalCase` (e.g., `UserProfile`, `KarmaCard`)
- **Files**: `PascalCase.tsx` (e.g., `UserProfile.tsx`)
- **Functions**: `camelCase` (e.g., `calculateKarma`, `handleSubmit`)
- **Variables**: `camelCase` (e.g., `karmaScore`, `isLoading`)
- **Constants**: `UPPER_SNAKE_CASE` (e.g., `API_ENDPOINTS`, `DEFAULT_TIMEOUT`)
- **CSS Classes**: Follow Tailwind conventions

### Tailwind CSS Guidelines

```typescript
// ✅ Good - Use design system classes
<div className="clean-card feature-card">
  <h3 className="text-gradient">Karma Score</h3>
  <p className="text-slate-600">Your reputation score</p>
</div>

// ✅ Good - Responsive design
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {/* Grid content */}
</div>

// ❌ Bad - Inline styles or non-responsive design
<div style={{ padding: '20px', backgroundColor: '#f8fafc' }}>
  <h3 style={{ color: '#0f172a' }}>Karma Score</h3>
</div>
```

### Component Organization

```
src/
├── components/
│   ├── ui/              # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   └── Modal.tsx
│   ├── features/        # Feature-specific components
│   │   ├── KarmaCard.tsx
│   │   ├── ContributionList.tsx
│   │   └── GitHubAnalysisDashboard.tsx
│   └── layout/          # Layout components
│       ├── Header.tsx
│       ├── Footer.tsx
│       └── Navigation.tsx
├── hooks/               # Custom React hooks
├── services/            # API and external service clients
├── store/               # Zustand state management
├── types/               # TypeScript type definitions
└── utils/               # Utility functions
```

## Component Architecture

### Component Types

1. **UI Components** (`src/components/ui/`):
   - Reusable, generic components
   - No business logic
   - Highly customizable with props

2. **Feature Components** (`src/components/features/`):
   - Business logic specific components
   - Connect to state management
   - Handle API interactions

3. **Layout Components** (`src/components/layout/`):
   - Page structure and navigation
   - Global UI elements

### State Management with Zustand

```typescript
// ✅ Good - Zustand store setup
interface AuthState {
  user: UserData | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  
  login: async (credentials) => {
    set({ isLoading: true });
    try {
      const user = await authService.login(credentials);
      set({ user, isAuthenticated: true, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },
  
  logout: () => {
    set({ user: null, isAuthenticated: false });
  },
}));
```

### Custom Hooks

```typescript
// ✅ Good - Custom hook for data fetching
export const useKarmaData = (username: string) => {
  return useQuery({
    queryKey: ['karma', username],
    queryFn: () => karmaService.getKarmaScore(username),
    enabled: !!username,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Usage in component
const { data: karmaData, isLoading, error } = useKarmaData(username);
```

### Error Handling

```typescript
// ✅ Good - Error boundaries and proper error handling
interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<
  PropsWithChildren<{}>,
  ErrorBoundaryState
> {
  constructor(props: PropsWithChildren<{}>) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">
              Something went wrong
            </h2>
            <button
              onClick={() => this.setState({ hasError: false })}
              className="btn-primary"
            >
              Try again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
```

## Testing

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm test UserProfile.test.tsx
```

### Testing Guidelines

#### Component Testing

```typescript
// UserProfile.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { UserProfile } from './UserProfile';

const mockUser: UserData = {
  username: 'testuser',
  karmaScore: 85,
  totalContributions: 150,
};

describe('UserProfile', () => {
  it('renders user information correctly', () => {
    render(<UserProfile user={mockUser} onUpdate={jest.fn()} />);
    
    expect(screen.getByText('testuser')).toBeInTheDocument();
    expect(screen.getByText('85')).toBeInTheDocument();
  });

  it('calls onUpdate when save button is clicked', () => {
    const mockOnUpdate = jest.fn();
    render(<UserProfile user={mockUser} onUpdate={mockOnUpdate} />);
    
    fireEvent.click(screen.getByText('Edit'));
    fireEvent.click(screen.getByText('Save'));
    
    expect(mockOnUpdate).toHaveBeenCalledWith(mockUser);
  });
});
```

#### Hook Testing

```typescript
// useKarmaData.test.ts
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useKarmaData } from './useKarmaData';

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

describe('useKarmaData', () => {
  it('fetches karma data successfully', async () => {
    const { result } = renderHook(() => useKarmaData('testuser'), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toBeDefined();
  });
});
```

### Test Categories
- **Unit Tests**: Individual components and utilities
- **Integration Tests**: Component interactions and API calls
- **E2E Tests**: Complete user workflows (using Cypress/Playwright)

## Pull Request Process

### Before Creating a PR

1. **Create a feature branch**:
   ```bash
   git checkout -b feature/karma-visualization
   ```

2. **Make your changes** following the style guidelines

3. **Run tests and linting**:
   ```bash
   npm run lint
   npm test
   npm run build
   ```

4. **Test in different browsers** (Chrome, Firefox, Safari)

5. **Commit your changes**:
   ```bash
   git add .
   git commit -m "feat: add karma score visualization component"
   ```

### Commit Message Format

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

**Types**:
- `feat`: New feature or component
- `fix`: Bug fix
- `style`: UI/styling changes
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `docs`: Documentation changes
- `chore`: Build process or auxiliary tool changes

**Examples**:
```
feat(karma): add karma score visualization chart
fix(auth): resolve wallet connection timeout issue
style(ui): update button hover animations
refactor(hooks): optimize useKarmaData caching logic
test(components): add tests for ContributionList component
```

### PR Requirements

- [ ] Tests pass (`npm test`)
- [ ] Build succeeds (`npm run build`)
- [ ] No console errors in development
- [ ] Responsive design tested on mobile/tablet/desktop
- [ ] Cross-browser compatibility verified
- [ ] PR description explains the changes
- [ ] Screenshots included for UI changes
- [ ] Accessibility considerations addressed

### PR Template

```markdown
## Description
Brief description of changes made.

## Type of Change
- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Style/UI update
- [ ] Refactoring (no functional changes)

## Screenshots
<!-- Include screenshots for UI changes -->

## Testing
- [ ] Unit tests added/updated
- [ ] Component tests added/updated
- [ ] Manual testing completed
- [ ] Cross-browser testing done
- [ ] Mobile responsiveness verified

## Checklist
- [ ] Code follows the style guidelines
- [ ] Self-review completed
- [ ] Tests pass locally
- [ ] Build succeeds
- [ ] No console errors
- [ ] Documentation updated (if needed)

## Related Issues
Closes #

## Additional Notes
```

## Issue Reporting

### Bug Reports

Use the bug report template:

```markdown
**Describe the bug**
A clear description of what the bug is.

**To Reproduce**
Steps to reproduce the behavior:
1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

**Expected behavior**
What you expected to happen.

**Screenshots**
If applicable, add screenshots to help explain your problem.

**Environment:**
- OS: [e.g. iOS, Android, Windows, macOS]
- Browser: [e.g. chrome, safari, firefox]
- Version: [e.g. 22]
- Device: [e.g. iPhone 12, Desktop]

**Additional context**
Add any other context about the problem here.
```

### Feature Requests

```markdown
**Is your feature request related to a problem?**
A clear description of what the problem is.

**Describe the solution you'd like**
A clear description of what you want to happen.

**Describe alternatives you've considered**
Other solutions you've considered.

**Additional context**
Any other context, mockups, or screenshots about the feature request.
```

## Design System & UI Guidelines

### Color Palette
- **Primary**: Blue shades (#f0f9ff to #0c4a6e)
- **Accent**: Green shades (#ecfdf5 to #064e3b) 
- **Neutral**: Slate-based grays (#f8fafc to #0f172a)

### Component Classes
- `.clean-card`: Main card styling with border and hover effects
- `.feature-card`: Feature showcase cards with hover animations
- `.btn-primary`: Primary CTA buttons (dark background)
- `.btn-secondary`: Secondary buttons (light background)
- `.text-gradient`: Gradient text effect for headings

### Typography
- **Font Family**: Inter for all text
- **Headings**: Use `font-display` class
- **Body**: Use `font-sans` with antialiasing
- **Code**: Use `font-mono` for technical examples

### Responsive Design
- **Mobile First**: Start with mobile styles, then add larger breakpoints
- **Breakpoints**: sm (640px), md (768px), lg (1024px), xl (1280px)
- **Touch Targets**: Minimum 44px for interactive elements
- **Content**: Readable line lengths, appropriate font sizes

### Accessibility Guidelines
- Use semantic HTML elements
- Provide proper ARIA labels and roles
- Ensure keyboard navigation works
- Maintain color contrast ratios (WCAG AA)
- Test with screen readers
- Include focus indicators for interactive elements

## Performance Guidelines

### Code Splitting
```typescript
// ✅ Good - Lazy load heavy components
const GitHubAnalysisDashboard = lazy(() => import('./GitHubAnalysisDashboard'));

// Usage with Suspense
<Suspense fallback={<LoadingSpinner />}>
  <GitHubAnalysisDashboard />
</Suspense>
```

### Image Optimization
- Use WebP format when possible
- Implement lazy loading for images
- Provide appropriate alt text
- Use responsive images with srcset

### Bundle Optimization
- Keep bundle size under 1MB total
- Use tree shaking for unused code
- Minimize third-party dependencies
- Implement proper code splitting

## Getting Help

- **GitHub Discussions**: For questions and ideas about frontend development
- **GitHub Issues**: For bugs and feature requests
- **React Documentation**: [React Official Docs](https://react.dev/)
- **Tailwind CSS**: [Tailwind Documentation](https://tailwindcss.com/docs)

---

Thank you for contributing to UmiKarma! 🚀

Your contributions help make decentralized reputation systems more accessible and user-friendly. 