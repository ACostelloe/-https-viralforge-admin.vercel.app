# 🚀 ViralForge AI Admin Control Panel

A modern, production-ready admin control panel for managing AI-powered social media content across multiple platforms.

![ViralForge Admin Panel](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)
![React](https://img.shields.io/badge/React-18.3.1-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6.3-blue)
![Vite](https://img.shields.io/badge/Vite-5.4.19-purple)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.4.17-cyan)

## ✨ Features

### 🎯 **Core Functionality**
- **Multi-Platform Management**: Twitter/X, Instagram, Facebook, LinkedIn integration
- **AI Content Generation**: OpenAI GPT-powered content creation
- **Real-time Dashboard**: Live metrics, system health, and activity monitoring
- **Content Scheduling**: Advanced scheduling with timezone support
- **Account Management**: Multi-account support with OAuth integration
- **Analytics & Reporting**: Comprehensive performance tracking

### 🛠️ **Technical Features**
- **Modern React 18** with TypeScript
- **Responsive Design** with Tailwind CSS
- **Production-Ready Build** with Vite
- **Comprehensive Testing** (Jest + RTL + Cypress)
- **CI/CD Pipeline** with GitHub Actions
- **Multi-Platform Deployment** (Vercel, Netlify, GitHub Pages, Surge)
- **Performance Optimized** with code splitting and lazy loading

## 🏗️ **Project Structure**

```
VItalForge/
├── admin-panel/                 # Main React application
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   ├── pages/             # Page components
│   │   ├── services/          # API services
│   │   ├── test/              # Test utilities and mocks
│   │   └── types/             # TypeScript definitions
│   ├── cypress/               # E2E tests
│   ├── scripts/               # Deployment scripts
│   └── dist/                  # Production build
├── .github/workflows/         # CI/CD pipelines
└── docs/                      # Documentation
```

## 🚀 **Quick Start**

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Git

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/your-username/VItalForge.git
cd VItalForge/admin-panel
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp env.example .env.local
# Edit .env.local with your API keys
```

4. **Start development server**
```bash
npm run dev
```

5. **Open your browser**
Navigate to `http://localhost:3000`

## 🔧 **Available Scripts**

### Development
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run build:prod   # Production build with optimizations
npm run preview      # Preview production build
```

### Testing
```bash
npm run test         # Run unit tests
npm run test:watch   # Run tests in watch mode
npm run test:coverage # Generate coverage report
npm run test:e2e     # Run E2E tests
```

### Deployment
```bash
npm run deploy              # Deploy to all platforms
npm run deploy:vercel       # Deploy to Vercel
npm run deploy:netlify      # Deploy to Netlify
npm run deploy:surge        # Deploy to Surge.sh
npm run deploy:github       # Deploy to GitHub Pages
```

### Code Quality
```bash
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint errors
npm run type-check   # TypeScript type checking
npm run analyze      # Bundle size analysis
```

## 🌐 **Deployment**

This project is configured for deployment on multiple free hosting platforms:

### **Vercel** (Recommended)
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/VItalForge&project-name=viralforge-admin&root-directory=admin-panel)

### **Netlify**
[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/your-username/VItalForge)

### **Manual Deployment**
See [DEPLOYMENT_GUIDE.md](admin-panel/DEPLOYMENT_GUIDE.md) for detailed instructions.

## 🔐 **Environment Variables**

Create a `.env.local` file in the `admin-panel` directory:

```bash
# API Configuration
VITE_API_BASE_URL=https://your-backend-api.com/api

# OpenAI
VITE_OPENAI_API_KEY=sk-your-openai-key

# Social Media APIs
VITE_TWITTER_API_KEY=your-twitter-key
VITE_TWITTER_API_SECRET=your-twitter-secret
VITE_INSTAGRAM_CLIENT_ID=your-instagram-id
VITE_FACEBOOK_APP_ID=your-facebook-id
VITE_LINKEDIN_CLIENT_ID=your-linkedin-id

# Analytics
VITE_GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
VITE_SENTRY_DSN=https://your-sentry-dsn
```

See [env.example](admin-panel/env.example) for all available variables.

## 🧪 **Testing**

### Unit Tests
```bash
npm run test
```

### E2E Tests
```bash
npm run test:e2e
```

### Coverage Report
```bash
npm run test:coverage
```

See [TESTING.md](admin-panel/TESTING.md) for detailed testing documentation.

## 📊 **Performance**

- **Lighthouse Score**: 95+ (Performance, Accessibility, Best Practices, SEO)
- **Bundle Size**: ~263kB total (80kB gzipped)
- **First Contentful Paint**: <2s
- **Largest Contentful Paint**: <3s
- **Cumulative Layout Shift**: <0.1

## 🔒 **Security**

- **Content Security Policy** headers
- **XSS Protection** enabled
- **HTTPS** enforced
- **Environment variables** for sensitive data
- **Dependency scanning** with automated updates

## 📚 **Documentation**

- [Deployment Guide](admin-panel/DEPLOYMENT_GUIDE.md) - Complete deployment instructions
- [Testing Guide](admin-panel/TESTING.md) - Testing strategies and best practices
- [API Integration](admin-panel/API_INTEGRATION.md) - API setup and configuration
- [Production Ready](admin-panel/PRODUCTION_READY.md) - Production deployment checklist

## 🛠️ **Tech Stack**

### Frontend
- **React 18.3.1** - UI library
- **TypeScript 5.6.3** - Type safety
- **Vite 5.4.19** - Build tool
- **Tailwind CSS 3.4.17** - Styling
- **React Router 6.28.0** - Routing
- **React Query 5.62.2** - Data fetching

### Testing
- **Jest 29.7.0** - Unit testing
- **React Testing Library** - Component testing
- **Cypress 13.16.1** - E2E testing
- **MSW 2.6.8** - API mocking

### Development
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Husky** - Git hooks
- **GitHub Actions** - CI/CD

## 🤝 **Contributing**

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 **Support**

- **Documentation**: Check the `/docs` folder
- **Issues**: [GitHub Issues](https://github.com/your-username/VItalForge/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-username/VItalForge/discussions)

## 🎉 **Acknowledgments**

- Built with modern React and TypeScript
- Styled with Tailwind CSS
- Deployed on free hosting platforms
- Tested with industry-standard tools

---

**🚀 Ready to manage your social media with AI? Deploy now and start creating viral content!**

[![Deploy to Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/VItalForge&project-name=viralforge-admin&root-directory=admin-panel) 