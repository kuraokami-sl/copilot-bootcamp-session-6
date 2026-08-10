# Feature Specification: Overdue Todo Items

**Feature Branch**: `feature/overdue-todo-items`

**Created**: 2026-08-10

**Status**: Draft

**Input**: User description: "Support for Overdue Todo Items — Users need a clear, visual way to identify which todos have not been completed by their due date."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - View Overdue Items at a Glance (Priority: P1)

A user opens the todo list and immediately sees which incomplete items are past their due date
without having to manually compare dates to today. Overdue items are visually distinct from
items that are on time or have no due date.

**Why this priority**: This is the core value of the feature. Without it, users cannot benefit
from the capability at all.

**Independent Test**: Open the todo list with a mix of overdue, on-time, and no-due-date todos.
Confirm overdue items are visually distinct without any additional action. Delivers immediate
value as a standalone slice.

**Acceptance Scenarios**:

1. **Given** an incomplete todo whose due date is before today, **When** the user views the list,
   **Then** the item displays an overdue visual indicator (e.g., distinct colour or label).
2. **Given** an incomplete todo whose due date is today or in the future, **When** the user views
   the list, **Then** the item does NOT display the overdue indicator.
3. **Given** an incomplete todo with no due date, **When** the user views the list, **Then** the
   item does NOT display the overdue indicator.

---

### User Story 2 - Completed Items Never Shown as Overdue (Priority: P2)

A user who has completed a task after its due date sees it marked as completed only — not as
overdue — so the overdue indicator remains meaningful and not cluttered with resolved work.

**Why this priority**: Without this, users would see noise from already-resolved items and lose
trust in the overdue signal.

**Independent Test**: Mark a past-due todo as complete. Confirm the overdue indicator disappears
or is not shown.

**Acceptance Scenarios**:

1. **Given** a completed todo whose due date is in the past, **When** the user views the list,
   **Then** the item does NOT display the overdue indicator.
2. **Given** an overdue todo, **When** the user marks it complete, **Then** the overdue indicator
   is removed immediately.

---

### Edge Cases

- What happens when the system date changes past midnight while the app is open? — The overdue
  status updates on the next page load or re-render; real-time polling is out of scope.
- What happens when a due date is set to today's date? — The item is NOT considered overdue until
  the following day.
- What happens when a todo's due date is removed after it was overdue? — The overdue indicator
  is removed immediately.
- What happens when a todo's due date is changed to a future date? — The overdue indicator is
  removed immediately.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST visually indicate any incomplete todo item whose due date is strictly
  before today's date.
- **FR-002**: Completed todo items MUST NOT display an overdue indicator regardless of their due
  date.
- **FR-003**: Todo items with no due date MUST NOT display an overdue indicator.
- **FR-004**: The overdue state MUST be computed from the current date at render time (page load
  or re-render); live real-time polling is out of scope.
- **FR-005**: When a user marks an overdue todo as complete, the overdue indicator MUST disappear
  immediately without a page reload.
- **FR-006**: When a user changes a todo's due date to today or a future date, the overdue
  indicator MUST disappear immediately without a page reload.
- **FR-007**: The overdue visual indicator MUST be distinguishable from the normal due-date
  display to users who rely on colour and shape cues (i.e., not rely on colour alone).

### Key Entities

- **Todo Item**: Has a title, optional due date, and completion status. An item is overdue when
  its due date is set, is before today's date, and the item is not complete.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A user can identify all overdue items on the todo list without manually comparing
  any dates — verified by visual inspection of the rendered list.
- **SC-002**: Zero completed items display the overdue indicator — verified by marking every
  past-due item complete and confirming no overdue indicators remain.
- **SC-003**: Zero items without a due date display the overdue indicator — verified by reviewing
  items created without a due date.
- **SC-004**: The overdue indicator disappears within the same render cycle when a todo is
  completed or its due date is updated — no full page reload required.

## Assumptions

- The existing todo data model already stores an optional due date and a completion status field;
  no new backend fields are required.
- "Today" is determined by the client's local date at render time; timezone handling beyond
  client-local time is out of scope.
- The visual indicator design (colour, icon, label text) follows the existing Halloween-themed
  design system defined in the UI Guidelines; specific visual choices are an implementation
  detail, not a spec constraint.
- The feature applies to the list view only; no changes to the create/edit form are required
  other than ensuring due date is already editable (which it is per existing requirements).
- Desktop-only; no mobile-specific layout changes are required.
