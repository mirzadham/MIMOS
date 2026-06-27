```markdown
# MIMOS Development Patterns

> Auto-generated skill from repository analysis

## Overview
This skill provides a comprehensive guide to the development patterns used in the MIMOS TypeScript codebase. It covers file naming, import/export styles, commit conventions, and detailed workflows for updating themes across both public and admin interfaces. This guide is designed to help contributors quickly understand and adopt the project's established practices.

## Coding Conventions

### File Naming
- **PascalCase** is used for all file names, especially components.
  - Example: `Header.tsx`, `Footer.tsx`, `LandingPage.tsx`

### Import Style
- **Alias imports** are preferred for referencing modules.
  - Example:
    ```typescript
    import Header from '@/components/layout/Header';
    ```

### Export Style
- **Default exports** are used for modules and components.
  - Example:
    ```typescript
    const Header = () => { /* ... */ };
    export default Header;
    ```

### Commit Messages
- **Conventional commits** are used with the following prefixes:
  - `feat`: New features
  - `fix`: Bug fixes
  - `chore`: Maintenance and non-feature changes
- **Average commit message length:** 66 characters
  - Example: `feat: add responsive header to admin dashboard`

## Workflows

### Theme Update Across Public and Admin UI
**Trigger:** When updating the application's color theme or visual style across both public-facing and admin UI pages and components.  
**Command:** `/update-theme`

1. **Update global stylesheet**  
   Edit `src/app/globals.css` to define new color variables or update theme rules.
   ```css
   :root {
     --primary-color: #0055ff;
     --secondary-color: #ffcc00;
   }
   ```
2. **Modify public-facing page components**  
   Update files in `src/app/(public)/*/page.tsx` to utilize the new theme variables.
   ```typescript
   <div className="bg-[var(--primary-color)] text-white">Welcome!</div>
   ```
3. **Modify admin dashboard components**  
   Update files in `src/app/admin/(dashboard)/*.tsx` to use the updated theme.
   ```typescript
   <section className="border-b-2 border-[var(--secondary-color)]">...</section>
   ```
4. **Update shared layout components**  
   Edit `src/components/layout/Header.tsx` and `src/components/layout/Footer.tsx` to match the new theme.
   ```typescript
   <header style={{ backgroundColor: 'var(--primary-color)' }}>...</header>
   ```
5. **Update landing and catalog components**  
   Update files in `src/components/landing/*.tsx` and any relevant catalog components to reflect the new theme.
   ```typescript
   <LandingPage className="bg-[var(--secondary-color)]" />
   ```

**Files Involved:**
- `src/app/(public)/*/page.tsx`
- `src/app/admin/(dashboard)/*.tsx`
- `src/app/globals.css`
- `src/components/layout/Header.tsx`
- `src/components/layout/Footer.tsx`
- `src/components/landing/*.tsx`
- `src/components/admin/*.tsx`

## Testing Patterns

- **Test files** follow the `*.test.*` pattern.
  - Example: `Header.test.tsx`
- **Testing framework** is currently unknown; check existing test files for framework usage.
- **Test Example:**
  ```typescript
  import Header from '@/components/layout/Header';

  test('renders header', () => {
    // ...test implementation
  });
  ```

## Commands

| Command        | Purpose                                                         |
|----------------|-----------------------------------------------------------------|
| /update-theme  | Apply a new color palette or theme update across all UI areas   |
```
