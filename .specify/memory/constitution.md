<!--
Sync Impact Report
==================
Version change: (unversioned) → 1.0.0
Added sections:
  - Core Principles (I–V)
  - Code Quality Standards
  - Development Workflow
  - Governance
Removed sections: none (template placeholders replaced)
Follow-up TODOs: none
-->

# Todo App Constitution

## Core Principles

### I. Single Responsibility
Every module, component, and function MUST have one well-defined responsibility. Organisational-only
abstractions without clear purpose are not permitted. Frontend components handle UI concerns;
backend services handle business logic and persistence. Cross-cutting concerns MUST be extracted
into shared utilities.

**Rationale**: Prevents tight coupling, reduces cognitive load, and makes individual pieces
independently testable and replaceable.

### II. Test-Driven Quality (NON-NEGOTIABLE)
All application code MUST be covered by automated tests. Target coverage is ≥ 80% across all
packages. Tests MUST be written before or alongside implementation — not after. Test names MUST
describe expected behaviour in plain language. Tests MUST be independent: no shared mutable state,
no ordering dependencies, all external dependencies mocked.

**Rationale**: Tests serve as living documentation and the primary safety net for refactoring.
Untested code is considered incomplete.

### III. Consistent Code Style
All JavaScript code MUST follow the project's formatting rules: 2-space indentation, LF line
endings, lines ≤ 100 characters, no trailing whitespace. Naming conventions are mandatory:
`camelCase` for variables and functions, `PascalCase` for React components and classes,
`UPPER_SNAKE_CASE` for constants. ESLint MUST pass with zero errors before merging.

**Rationale**: Consistency lowers the barrier for contributors and reduces noise in code reviews.

### IV. Simplicity Over Premature Optimisation
Features MUST implement only what is specified in the functional requirements. Gold-plating,
speculative abstractions, and out-of-scope features (e.g., filtering, search, multi-user support)
are explicitly prohibited. YAGNI applies: build what is needed, when it is needed.

**Rationale**: The project is a focused bootcamp starter; scope creep undermines its teaching goals
and increases maintenance burden.

### V. Design Consistency
All UI work MUST conform to the defined design system: the 8 px spacing grid, the Halloween-themed
colour palette (light and dark mode tokens), and the Material Design-inspired component patterns
described in the UI Guidelines. Hard-coded values that bypass CSS custom properties are not
permitted.

**Rationale**: Visual consistency builds user trust and simplifies future theming or reskin efforts.

## Code Quality Standards

- Dependencies: React + CSS for the frontend; Node.js + Express.js for the backend. Introducing
  new runtime dependencies requires explicit justification.
- No circular imports. Import order: external libraries → internal modules → styles.
- Confirmation dialogs MUST be shown for destructive actions (e.g., delete).
- All API communication errors MUST be handled gracefully; the user MUST never see an unhandled
  exception.
- No database schema changes are permitted beyond basic todo storage.

## Development Workflow

- Run `npm install` at the monorepo root to install all workspace dependencies.
- Run `npm run start` at the root to start both frontend and backend concurrently.
- Run `npm test` at the root to execute tests for all packages.
- Tests are colocated with source files in `__tests__/` subdirectories.
- All code changes MUST pass ESLint and the full test suite before being merged.
- Pull requests require at least one review and green CI checks.

## Governance

This constitution supersedes all informal practices. Any amendment requires:

1. A written rationale explaining the change and its impact.
2. Updates to any affected documentation in `docs/`.
3. A version bump according to semantic versioning:
   - **MAJOR**: Removal or incompatible redefinition of an existing principle.
   - **MINOR**: New principle or section added.
   - **PATCH**: Clarification, wording fix, or non-semantic refinement.

All PRs and code reviews MUST verify compliance with these principles. Deviations must be
documented as explicit exceptions with a justification comment.

**Version**: 1.0.0 | **Ratified**: 2026-08-10 | **Last Amended**: 2026-08-10
