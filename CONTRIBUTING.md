# Contributing to YK Construction Management System

Thank you for your interest in contributing to YK Construction Management System! This document provides guidelines and information for contributors.

## 🤝 How to Contribute

### Reporting Issues

1. **Search existing issues** first to avoid duplicates
2. **Use clear, descriptive titles** for new issues
3. **Provide detailed information** including:
   - Steps to reproduce the issue
   - Expected vs actual behavior
   - Environment details (OS, Node.js version, etc.)
   - Screenshots if applicable

### Suggesting Features

1. **Check existing feature requests** to avoid duplicates
2. **Clearly describe the feature** and its use case
3. **Explain why this feature would be beneficial**
4. **Consider implementation complexity and maintainability**

### Pull Requests

1. **Fork the repository** and create a new branch
2. **Follow coding standards** and conventions
3. **Write clear commit messages**
4. **Include tests** for new functionality
5. **Update documentation** as needed
6. **Ensure all tests pass** before submitting

## 🏗️ Development Setup

### Prerequisites
- Node.js 18+
- PostgreSQL 15+
- Git

### Local Development
```bash
# Fork and clone the repository
git clone https://github.com/yourusername/yk-construction.git
cd yk-construction

# Install dependencies
cd backend && npm install
cd ../frontend && npm install

# Set up environment
cp backend/.env.example backend/.env.development
# Edit .env.development with your configuration

# Set up database
cd backend
npm run db:migrate
npm run db:seed

# Start development servers
npm run dev # Backend
cd ../frontend && npm start # Frontend
```

## 📝 Coding Standards

### JavaScript/Node.js
- Use **ES6+ features** where appropriate
- Follow **ESLint configuration**
- Use **camelCase** for variables and functions
- Use **PascalCase** for classes and components
- Add **JSDoc comments** for functions and classes

### React/Frontend
- Use **functional components** with hooks
- Follow **React best practices**
- Use **Tailwind CSS** for styling
- Keep components **small and focused**
- Use **meaningful component and prop names**

### Database
- Use **descriptive table and column names**
- Follow **Sequelize conventions**
- Write **proper migrations** with rollback support
- Include **proper indexes** for performance

### API Design
- Follow **RESTful principles**
- Use **consistent naming conventions**
- Include **proper HTTP status codes**
- Provide **clear error messages**
- Document **all endpoints**

## 🧪 Testing

### Backend Testing
```bash
cd backend
npm test
```

### Frontend Testing
```bash
cd frontend
npm test
```

### Test Coverage
- Aim for **>80% test coverage**
- Write **unit tests** for utilities and business logic
- Write **integration tests** for API endpoints
- Write **component tests** for React components

## 📋 Commit Message Guidelines

Use the following format for commit messages:

```
type(scope): description

body (optional)

footer (optional)
```

### Types
- **feat**: New feature
- **fix**: Bug fix
- **docs**: Documentation changes
- **style**: Code style changes (formatting, etc.)
- **refactor**: Code refactoring
- **test**: Adding or updating tests
- **chore**: Maintenance tasks

### Examples
```
feat(auth): add password reset functionality

fix(api): resolve user authentication issue

docs(readme): update installation instructions

refactor(database): optimize query performance
```

## 🔍 Code Review Process

1. **All changes require review** before merging
2. **Address review feedback** promptly
3. **Keep changes focused** and atomic
4. **Explain complex logic** with comments
5. **Ensure backward compatibility** where possible

## 🏷️ Release Process

1. **Version numbering** follows [Semantic Versioning](https://semver.org/)
2. **Changelog** is updated for each release
3. **Database migrations** are tested thoroughly
4. **Backward compatibility** is maintained for API changes

## 📚 Documentation

### Code Documentation
- Write **clear, concise comments**
- Document **complex algorithms** and business logic
- Include **usage examples** for functions and classes
- Keep **documentation up to date** with code changes

### API Documentation
- Document **all endpoints** with examples
- Include **request/response schemas**
- Specify **authentication requirements**
- Provide **error code descriptions**

## 🛡️ Security Guidelines

- **Never commit secrets** or credentials
- **Validate all inputs** on both client and server
- **Use parameterized queries** to prevent SQL injection
- **Implement proper authentication** and authorization
- **Follow OWASP security guidelines**

## 📄 License

By contributing to this project, you agree that your contributions will be licensed under the MIT License.

## 🆘 Getting Help

If you need help with development:

1. **Check the documentation** first
2. **Search existing issues** for similar problems
3. **Join our community discussions**
4. **Ask questions** in GitHub Discussions
5. **Contact maintainers** for complex issues

## 👥 Community

- Be **respectful and inclusive**
- **Help others** when possible
- **Share knowledge** and best practices
- **Provide constructive feedback**

Thank you for contributing to YK Construction Management System! 🚀
