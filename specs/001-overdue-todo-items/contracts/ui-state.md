# UI State Contract: Overdue Todo Items

**Date**: 2026-08-10
**Feature**: specs/001-overdue-todo-items

This document defines the UI rendering contract for the overdue indicator. Because this
feature has no new API endpoints, the contract is between the `isOverdue` utility and the
`TodoCard` component.

---

## `isOverdue` Utility Contract

**Module**: `packages/frontend/src/utils/dateUtils.js`

**Export**: Named export `isOverdue`

```
isOverdue(dueDate, completed) → boolean
```

| Input | Type | Valid values |
|-------|------|--------------|
| `dueDate` | `string \| null \| undefined` | `YYYY-MM-DD`, `null`, `undefined`, `""` |
| `completed` | `number \| boolean` | `0`, `1`, `true`, `false` |

| Output | Meaning |
|--------|---------|
| `true` | Item MUST display overdue indicator |
| `false` | Item MUST NOT display overdue indicator |

**Guarantees**:
- Pure function — no side effects, no I/O, no mutation
- Deterministic within a single local calendar day (may differ across midnight)
- Always returns `false` for completed items regardless of `dueDate` (FR-002)
- Always returns `false` when `dueDate` is absent (FR-003)
- Always returns `false` when `dueDate` equals today (FR-004)

---

## `TodoCard` Rendering Contract

**Module**: `packages/frontend/src/components/TodoCard.js`

### When `isOverdue` returns `true`

The rendered card MUST:

1. Include the CSS class `todo-card--overdue` on the root element
   (in addition to any existing classes such as `todo-card`)
2. Render an overdue badge element adjacent to the due date line, containing:
   - A text label (e.g., "Overdue") — required for non-colour signal (FR-007)
   - An icon (e.g., ⚠) — optional but recommended
3. Apply `var(--danger-color)` via the CSS class (not inline styles)
4. NOT show the overdue indicator when `todo.completed === 1`

### When `isOverdue` returns `false`

The rendered card MUST NOT include the `todo-card--overdue` class or the overdue badge.

### Re-render behaviour (User Stories 2 & 3)

Because `isOverdue` is invoked on every render using the current `todo.dueDate` and
`todo.completed` props, no additional state or effect is required — toggling completion
or editing the due date already triggers a parent state update, which re-renders
`TodoCard` and re-evaluates `isOverdue` automatically (FR-005, FR-006). No `setInterval`
or other timer-based refresh is permitted (FR-009).

### List ordering (FR-008)

The `TodoList` component MUST NOT change sort/filter logic based on overdue status.
Todos remain ordered by `createdAt` (newest first) exactly as before this feature;
the overdue indicator is a `TodoCard`-level visual annotation only.

---

## CSS Class Contract

**Selector**: `.todo-card--overdue`

**Defined in**: `packages/frontend/src/App.css`

Required declarations:

| Property | Value |
|----------|-------|
| Border or left-border accent | `var(--danger-color)` |
| Badge / label colour | `var(--danger-color)` |

MUST NOT hard-code any colour values — MUST reference CSS custom properties from
`packages/frontend/src/styles/theme.css` so dark mode is automatically supported.

---

## Invariants

- A todo that is both completed and past its due date: renders as **completed only**,
  never as overdue
- A todo with no due date: renders with **no date information and no overdue indicator**
- A todo due exactly today: renders with **no overdue indicator**
- The overdue state updates **within the same React render cycle** as toggle/edit actions —
  no polling, no extra API calls required (FR-009)
- The relative order of todos in the list is unaffected by overdue status (FR-008)
