# MIMOS Development Patterns

> Auto-generated skill from repository analysis

## Overview
This skill teaches the core development conventions and patterns used in the MIMOS TypeScript codebase. You will learn file naming strategies, import/export styles, commit message conventions, and how to write and organize tests. This guide also provides suggested commands for common workflows.

## Coding Conventions

### File Naming
- **Pattern:** PascalCase  
  **Example:**  
  ```
  MyComponent.ts
  UserService.ts
  ```

### Import Style
- **Pattern:** Use alias imports  
  **Example:**  
  ```typescript
  import UserService from '@services/UserService';
  ```

### Export Style
- **Pattern:** Default exports  
  **Example:**  
  ```typescript
  // UserService.ts
  export default class UserService { ... }
  ```

### Commit Messages
- **Pattern:** Conventional commits with `feat` prefix  
  **Example:**  
  ```
  feat: add user authentication module with JWT support
  ```

## Workflows

_No automated workflows detected in this repository._

## Testing Patterns

- **Framework:** Unknown (not detected)
- **File Pattern:** Test files are named with `.test.` in the filename.
  **Example:**  
  ```
  UserService.test.ts
  AuthController.test.ts
  ```
- **Placement:** Test files are typically placed alongside the files they test or in a dedicated test directory.

## Commands
| Command      | Purpose                                    |
|--------------|--------------------------------------------|
| /new-feature | Scaffold a new feature file in PascalCase  |
| /test-file   | Create a new `.test.ts` file for a module  |
| /commit      | Generate a conventional commit message     |