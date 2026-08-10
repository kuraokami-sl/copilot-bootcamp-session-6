# Implementation Plan: Overdue Todo Items

**Branch**: `001-overdue-todo-items` | **Date**: 2026-08-10 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `specs/001-overdue-todo-items/spec.md`

## Summary

Add a visual overdue indicator to the `TodoCard` component so that any incomplete todo whose
due date is strictly before today is immediately distinguishable (User Story 1), the indicator
disappears the moment a task is completed (User Story 2), and it reacts immediately when the
due date is changed or cleared (User Story 3). Per the clarified spec, the feature is styling
only: no todo reordering (FR-008) and no time-based polling — overdue status is recalculated
only on render (FR-009). The change is purely a frontend presentation concern — no backend
modifications are required. A pure utility function (`isOverdue`) encapsulates the date
comparison logic and is independently unit-tested.

## Technical Context

**Language/Version**: JavaScript (ES2020) — Node.js 16+ / React 18

**Primary Dependencies**: React, `@testing-library/react`, Jest

**Storage**: Existing SQLite-backed Express.js API (no changes). `dueDate` is stored and
returned as an ISO date string (`YYYY-MM-DD`). `completed` is stored as integer 0/1.

**Testing**: Jest + `@testing-library/react` (frontend), Jest (backend — no changes needed)

**Target Platform**: Desktop web browser (Chrome/Firefox/Edge modern versions)

**Project Type**: Web application — React SPA frontend + Express.js REST API backend (monorepo)

**Performance Goals**: Overdue state computed synchronously at render time; instant visual
update on toggle/edit (User Stories 2 and 3) with no additional network round-trip.

**Constraints**: No backend changes. Must pass ESLint. Must use CSS custom properties
(no hard-coded colours). Must satisfy the 8 px spacing grid. Must not rely on colour alone
for the overdue signal (FR-007). Must not reorder the todo list (FR-008). Must not introduce
timers/polling to refresh overdue state (FR-009).

**Scale/Scope**: Single-user todo app; small number of todos per user.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Single Responsibility | ✅ PASS | Overdue logic extracted to a standalone utility; `TodoCard` only handles rendering |
| II. Test-Driven Quality | ✅ PASS | `isOverdue` utility and updated `TodoCard` rendering both require unit tests; ≥80% coverage maintained |
| III. Consistent Code Style | ✅ PASS | `camelCase` for utility, `PascalCase` preserved for component; ESLint must stay green |
| IV. Simplicity | ✅ PASS | No filtering, sorting, or extra features introduced; only what the spec defines. No reordering (FR-008) and no polling/timers (FR-009) confirmed via clarification |
| V. Design Consistency | ✅ PASS | CSS class uses `var(--danger-color)` token; text badge ensures signal beyond colour alone |

All gates pass. No complexity violations to track.

## Project Structure

### Documentation (this feature)

```text
specs/001-overdue-todo-items/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
│   └── ui-state.md
└── tasks.md             # Phase 2 output (/speckit-tasks — NOT created here)
```

### Source Code (affected files only)

```text
packages/frontend/
├── src/
│   ├── components/
│   │   └── TodoCard.js                      # add overdue CSS class + badge
│   ├── utils/
│   │   └── dateUtils.js                     # new — isOverdue(dueDate, completed)
│   └── App.css                              # add .todo-card--overdue styles
└── src/
    ├── components/
    │   └── __tests__/
    │       └── TodoCard.test.js             # new/updated overdue rendering tests
    └── utils/
        └── __tests__/
            └── dateUtils.test.js            # new — unit tests for isOverdue
```

**Structure Decision**: Web application (Option 2). This feature touches only the frontend
package. No new packages, routes, or backend files are introduced.
