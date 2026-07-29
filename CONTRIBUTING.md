# Contributing to MIMOS Academy Portal

Thank you for contributing! To maintain high code quality, security, and smooth collaboration, please follow these guidelines.

---

## 🔀 Git Workflow & Branching Strategy

1. **Never push directly to `main`**. All work must be done in feature or bugfix branches and submitted via Pull Request (PR).
2. **Branch Naming Conventions**:
   * `feat/short-description` — New features (e.g., `feat/events-filter`)
   * `fix/short-description` — Bug fixes (e.g., `fix/auth-cookie-expiration`)
   * `docs/short-description` — Documentation changes
   * `refactor/short-description` — Code improvements without behavior changes
3. **Commit Messages**: Follow [Conventional Commits](https://www.conventionalcommits.org/):
   * `feat: add course filter dropdown`
   * `fix: correct Prisma transaction timeout`
   * `test: add unit test for admin action`

---

## 📝 Pull Request Checklist

Before submitting a PR, verify the following locally:

- [ ] `npm test` runs and all tests pass (100% pass rate).
- [ ] `npm run lint` completes with zero errors.
- [ ] `npm run build` succeeds without TypeScript or compilation errors.
- [ ] No secrets, passwords, or personal credentials are included in code or commits.
- [ ] Clear PR title and description outlining what was changed and why.

---

## 🛡️ Security Guidelines

* Do **NOT** commit `.env` or any real credentials.
* Use environment variables for sensitive settings.
* Validate all user inputs on both client and server sides.
