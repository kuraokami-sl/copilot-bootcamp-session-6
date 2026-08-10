# Research: Overdue Todo Items

**Date**: 2026-08-10
**Feature**: specs/001-overdue-todo-items

## Question 1: Where should `isOverdue` logic live?

**Decision**: A standalone pure utility function in
`packages/frontend/src/utils/dateUtils.js`.

**Rationale**: Placing the comparison in a dedicated utility satisfies Principle I
(Single Responsibility) — `TodoCard` remains a pure rendering component and the date
logic is independently unit-testable without rendering any JSX. Co-locating it inside
`TodoCard.js` would mix presentation and business-rule concerns.

**Alternatives considered**:
- Inside `TodoCard.js` directly — rejected; mixes concerns and harder to test in isolation.
- Inside a custom React hook — rejected; overkill for a synchronous, side-effect-free
  computation. Hooks add overhead when a plain function suffices.
- Inside a shared backend utility — rejected; the spec is presentation-only and the
  backend has no need to know whether an item is overdue.

---

## Question 2: How to compare dates reliably (avoid timezone/time-of-day bugs)?

**Decision**: Compare the `dueDate` string (`YYYY-MM-DD`) against
`new Date().toLocaleDateString('en-CA')` which also returns `YYYY-MM-DD` in the
client's local timezone. String comparison (`dueDate < today`) is safe because
ISO date strings sort lexicographically.

**Rationale**: The HTML `<input type="date">` stores and submits values in
`YYYY-MM-DD` format. The backend stores this verbatim. Using `new Date(dueDate)`
and comparing timestamps would introduce off-by-one errors around midnight and
timezone boundaries because `new Date('2026-08-10')` is parsed as UTC midnight,
which may be "yesterday" in western timezones. String comparison against the local
date string eliminates that ambiguity, and directly satisfies FR-004 (due-today is
never overdue).

**Alternatives considered**:
- `new Date(dueDate) < new Date()` — rejected; midnight UTC/local timezone mismatch
  causes false positives around midnight.
- `date-fns` or `dayjs` library — rejected; Principle IV (Simplicity/YAGNI): the
  logic is a single string comparison and does not justify a new runtime dependency.

---

## Question 3: How to satisfy the "not colour-alone" accessibility requirement (FR-007)?

**Decision**: Render a visible text badge "Overdue" (plus a ⚠ icon) alongside the
due date, styled with `var(--danger-color)` for colour-sighted users. The text
provides the signal for colour-blind users.

**Rationale**: WCAG 1.4.1 (Use of Colour) requires that information conveyed by
colour also be available through another means. A short text label costs nothing
to implement and works across all assistive technologies.

**Alternatives considered**:
- Border highlight only — rejected; colour-blind users would not receive the signal.
- `aria-label` change only — rejected; screen readers would convey it but sighted
  colour-blind users would still miss it.

---

## Question 4: Does `todo.completed` need special handling in comparison?

**Decision**: The `isOverdue` function signature is
`isOverdue(dueDate, completed)` and returns `false` immediately when
`completed` is truthy (1 or `true`), directly satisfying FR-002.

**Rationale**: The backend stores `completed` as an integer (0/1) as confirmed
in the source (`checked={todo.completed === 1}`). The utility must handle both
integer and boolean representations defensively since the API may evolve.

**Alternatives considered**:
- Check `completed === 0` strictly — rejected; fragile against future API changes
  that return a boolean.
- Rely on callers to filter — rejected; puts an implicit contract on every call site.

---

## Question 5: How is immediate re-evaluation achieved for User Stories 2 and 3?

**Decision**: No dedicated mechanism is needed — `isOverdue` is called during every
`TodoCard` render, and React already re-renders `TodoCard` whenever `todo.completed`
or `todo.dueDate` changes (both flow down as props from parent state). Toggling
completion or editing the due date already triggers a state update and re-render
in the existing codebase.

**Rationale**: Since overdue state is derived (not stored), it is automatically
recomputed on every render with no caching, timers, or subscriptions required.
This was confirmed in the 2026-08-10 clarification session and is now codified
as FR-009 (recalculate on render only, no polling) and FR-008 (no reordering of
the list based on overdue status).

**Alternatives considered**:
- `setInterval` polling to refresh overdue state — rejected; unnecessary since the
  state changes only in response to user actions that already trigger re-renders,
  and continuous polling for elapsed time was explicitly scoped out (FR-009).
- Sorting/grouping overdue items to the top of the list — rejected; explicitly
  scoped out by the user during clarification (FR-008) to keep the change
  presentation-only and avoid new list-ordering logic.

---

## All NEEDS CLARIFICATION items: Resolved

No `[NEEDS CLARIFICATION]` markers were present in the spec. All research questions
arose from codebase exploration and are now resolved. Two additional scope questions
(list reordering, live midnight refresh) were confirmed with the user during the
`/speckit-clarify` session on 2026-08-10 and are codified as FR-008 and FR-009.
Implementation can proceed.
