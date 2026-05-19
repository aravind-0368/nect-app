# Contributing Guide

Thank you for contributing to `nect-app`!

## Coding Standards

- Use consistent React and JavaScript conventions.
- Keep components small and focused.
- Use functional components and hooks.
- Follow existing file structure and naming.
- Keep styles in the component CSS files.

## Branching Strategy

- `main` or `master` — stable production-ready code
- `develop` — integration branch for ongoing work
- feature branches — use `feature/<name>`

Example:

```bash
git checkout -b feature/add-firebase-sync
```

## Pull Request Guidelines

- Create a PR from a feature branch into `main` or `develop`.
- Provide a clear summary of changes.
- Include testing steps.
- Keep PRs small and focused.
- Address requested changes promptly.

## Testing

- Run the app locally:

```bash
npm install
npm start
```

- Verify the UI and Firebase connectivity.

## Issues

- Open an issue for bugs, feature requests, or documentation updates.
- Reference related issue numbers in your PR.
