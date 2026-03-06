# Contributing to Chrome State Machine

Thank you for your interest in contributing. This document outlines the process for contributing to the project.

## Reporting Issues

Before reporting a new issue, please search existing issues to avoid duplicates. When reporting, include:

- A clear description of the problem
- Steps to reproduce the issue
- Your environment (Node version, Chrome version, OS)
- Any relevant error messages or logs
- A minimal code example that demonstrates the problem if applicable

## Development Workflow

1. Fork the repository and create your branch from main
2. Make your changes following the code style guidelines
3. Test your changes thoroughly
4. Commit with clear, descriptive messages
5. Push to your fork and submit a pull request

## Code Style

- Use TypeScript for all new code
- Follow the existing code patterns in the repository
- Run `npm run build` to verify TypeScript compilation
- Keep functions focused and small
- Add JSDoc comments for public APIs

## Testing

This project uses TypeScript compilation for validation. Before submitting:

```bash
npm run build
```

Ensure the build completes without errors. Future test coverage is planned.

## License

By contributing to chrome-state-machine, you agree that your contributions will be licensed under the MIT License.
