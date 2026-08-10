---

description: "Task list template for feature implementation"
---

# Tasks: Overdue Todo Items

**Input**: Design documents from `/specs/001-overdue-todo-items/`

**Prerequisites**: [plan.md](./plan.md), [spec.md](./spec.md), [research.md](./research.md), [data-model.md](./data-model.md), [contracts/ui-state.md](./contracts/ui-state.md), [quickstart.md](./quickstart.md)

**Tests**: Included. The project constitution (Principle II — Test-Driven Quality, NON-NEGOTIABLE) requires ≥80% coverage and test-first development for all code changes, so test tasks are mandatory here even though the spec did not explicitly request them.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

Web app (per [plan.md](./plan.md) Structure Decision): `packages/frontend/src/` only. No backend changes.

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Prepare the new module location for the date utility

- [X] T001 Create `packages/frontend/src/utils/` and `packages/frontend/src/utils/__tests__/` directories to host the new date utility and its tests

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: The `isOverdue` utility is shared by all three user stories (it is the single source of truth for whether a todo is overdue). It MUST exist and be correct before any user story's rendering behavior can be implemented or tested.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T002 [P] Write failing unit tests for `isOverdue(dueDate, completed)` in `packages/frontend/src/utils/__tests__/dateUtils.test.js` covering: past date + incomplete → true; past date + complete → false; today + incomplete → false; future date + incomplete → false; null/empty date → false; boolean `completed` → false (per [data-model.md](./data-model.md), FR-001–FR-004)
- [X] T003 Implement `isOverdue(dueDate, completed)` pure function in `packages/frontend/src/utils/dateUtils.js` using local-date string comparison (`new Date().toLocaleDateString('en-CA')`) per [research.md](./research.md) Q2, satisfying T002's tests

**Checkpoint**: Foundation ready — `isOverdue` is implemented, tested, and passing. User story implementation can now begin.

---

## Phase 3: User Story 1 - Spot Overdue Tasks Instantly (Priority: P1) 🎯 MVP

**Goal**: Any incomplete todo whose due date is before today is immediately visually flagged as overdue when the list renders; on-time, future, and no-due-date todos are never flagged.

**Independent Test**: Render a list with a mix of overdue, due-today, upcoming, and no-due-date todos and confirm only the truly overdue ones show the indicator, with no user interaction required.

### Tests for User Story 1

- [X] T004 [P] [US1] Write failing rendering tests in `packages/frontend/src/components/__tests__/TodoCard.test.js` for: overdue todo shows `todo-card--overdue` class + "Overdue" text; on-time todo does not; future-date todo does not; no-due-date todo does not; due-today todo does not (FR-001, FR-003, FR-004)

### Implementation for User Story 1

- [X] T005 [US1] Import `isOverdue` and conditionally render the `todo-card--overdue` class plus an "Overdue" text badge (with ⚠ icon) next to the due date in `packages/frontend/src/components/TodoCard.js` per [contracts/ui-state.md](./contracts/ui-state.md) (depends on T003)
- [X] T006 [US1] Add `.todo-card--overdue` styles (border/badge using `var(--danger-color)`, no hard-coded colours) to `packages/frontend/src/App.css`, verified in both light and dark mode via `packages/frontend/src/styles/theme.css` tokens

**Checkpoint**: User Story 1 is fully functional and independently testable — overdue items are visually distinguishable on load.

---

## Phase 4: User Story 2 - Overdue Signal Reflects Completion State (Priority: P2)

**Goal**: Marking an overdue todo complete removes its overdue indicator immediately, and completed todos never show the indicator regardless of due date.

**Independent Test**: Mark an overdue todo complete and confirm the indicator disappears immediately without a page reload.

**Note**: No new implementation is required — `isOverdue` (T003) already returns `false` for completed items, and `TodoCard` (T005) already re-renders whenever the `completed` prop changes via the existing toggle handler. This story only adds regression tests confirming that behavior.

### Tests for User Story 2

- [X] T007 [P] [US2] Write tests in `packages/frontend/src/components/__tests__/TodoCard.test.js` for: toggling an overdue todo to complete removes the `todo-card--overdue` class/badge on re-render; a todo rendered as already-completed with a past due date never shows the badge (FR-002, FR-005)

**Checkpoint**: User Stories 1 AND 2 both work independently.

---

## Phase 5: User Story 3 - Overdue Signal Reacts to Due Date Changes (Priority: P3)

**Goal**: Editing a todo's due date (to the past, to today/future, or clearing it) updates the overdue indicator immediately.

**Independent Test**: Edit an overdue todo's due date to a future date and confirm the indicator disappears immediately; edit an on-time todo's due date to the past and confirm the indicator appears immediately.

**Note**: No new implementation is required — the existing edit flow in `TodoCard` already updates `todo.dueDate` via the `onEdit` prop, causing a re-render that re-evaluates `isOverdue` (T003). This story only adds regression tests confirming that behavior.

### Tests for User Story 3

- [X] T008 [P] [US3] Write tests in `packages/frontend/src/components/__tests__/TodoCard.test.js` for: editing an overdue todo's due date to today/future removes the badge; editing an on-time todo's due date to the past adds the badge; clearing an overdue todo's due date removes the badge (FR-006)

**Checkpoint**: All three user stories are independently functional.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Validate the negative constraints (FR-008, FR-009) and overall quality gates from the clarification session and constitution

- [X] T009 [P] Add a regression test in `packages/frontend/src/components/__tests__/TodoList.test.js` confirming todo display order is unchanged by overdue status (FR-008)
- [ ] T010 Run `npx eslint packages/frontend/src` and fix any violations introduced by this feature
- [ ] T011 Run `npx jest --coverage --collectCoverageFrom="packages/frontend/src/**/*.js" packages/frontend/src/utils/__tests__/dateUtils.test.js packages/frontend/src/components/__tests__/TodoCard.test.js packages/frontend/src/components/__tests__/TodoList.test.js` and confirm ≥80% coverage per Testing Guidelines
- [ ] T012 Execute [quickstart.md](./quickstart.md) Scenarios A–H manually in the browser (light + dark mode) and confirm all pass

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
- **Foundational (Phase 2)**: Depends on Setup (T001) — BLOCKS all user stories
- **User Story 1 (Phase 3)**: Depends on Foundational (T002, T003) completion
- **User Story 2 (Phase 4)**: Depends on Foundational (T002, T003) and User Story 1 (T005) since it tests the same `TodoCard` render path
- **User Story 3 (Phase 5)**: Depends on Foundational (T002, T003) and User Story 1 (T005), same as US2
- **Polish (Phase 6)**: Depends on all three user stories being complete

### Within Each Phase

- Tests (T002, T004, T007, T008) MUST be written and FAIL before their corresponding implementation task
- Foundational utility (T003) before any component work (T005)
- CSS (T006) can proceed in parallel with T005 once T003 is done, since they touch different files

### Parallel Opportunities

- T002 (foundational tests) can be written in parallel with T001 (directory setup) is a prerequisite, so T002 depends on T001 only for the directory to exist
- T004 and T006 touch different files and can proceed in parallel once T003 is complete
- T007, T008, and T009 all touch test files independent of each other and can run in parallel once T005 is complete

---

## Parallel Example: Foundational Phase

```bash
# T002 and T003 both touch dateUtils files but T003 depends on T002's tests existing first (TDD).
# Launch T002 alone, confirm it fails, then implement T003.
Task: "Write failing unit tests for isOverdue in packages/frontend/src/utils/__tests__/dateUtils.test.js"
```

## Parallel Example: User Story 1

```bash
# T004 (tests) and T006 (CSS) can be worked in parallel once T003 (isOverdue) is done;
# T005 (TodoCard rendering) depends on T003 but not on T006.
Task: "Write failing rendering tests in packages/frontend/src/components/__tests__/TodoCard.test.js"
Task: "Add .todo-card--overdue styles to packages/frontend/src/App.css"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001)
2. Complete Phase 2: Foundational (T002, T003) — CRITICAL, blocks everything else
3. Complete Phase 3: User Story 1 (T004–T006)
4. **STOP and VALIDATE**: Run quickstart.md Scenarios A and F independently
5. This delivers a fully working, demonstrable overdue indicator (US1) even before US2/US3 are built

### Incremental Delivery

1. Setup + Foundational → US1 → Validate (MVP!) → Deploy/Demo
2. Add US2 → Validate (toggle behavior) → Deploy/Demo
3. Add US3 → Validate (edit behavior) → Deploy/Demo
4. Polish (T009–T012) → Final validation
