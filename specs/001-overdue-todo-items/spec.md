# Feature Specification: Overdue Todo Items

**Feature Branch**: `001-overdue-todo-items`

**Created**: 2026-08-10

**Status**: Draft

**Input**: User description: "Support for Overdue Todo Items — As a todo application user, I
want to easily identify and distinguish overdue tasks in my todo list, so that I can prioritize
my work and quickly see which tasks are past their due date."

## Clarifications

### Session 2026-08-10

- Q: Should overdue todos be moved or grouped to the top of the list, or stay in the existing creation-date order with only a visual style difference? → A: Keep existing creation-date order; visual indicator only (no reordering).
- Q: Should the overdue indicator update live while the page stays open past midnight, or only recalculate the next time the user interacts with or reloads the page? → A: Recalculate only on next interaction or page reload (no live polling).

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Spot Overdue Tasks Instantly (Priority: P1)

As a todo application user, when I open my todo list, I want overdue tasks to stand out
visually so I can immediately tell which items need my attention without comparing each due
date to today myself.

**Why this priority**: This is the entire value proposition of the feature. Without a visible
distinction, the feature delivers no benefit.

**Independent Test**: Populate the list with a mix of overdue, due-today, upcoming, and
no-due-date todos. Confirm overdue items are immediately visually distinguishable on load,
with no user interaction required.

**Acceptance Scenarios**:

1. **Given** an incomplete todo with a due date before today, **When** the list is displayed,
   **Then** that todo is shown with a distinct overdue indicator.
2. **Given** an incomplete todo due today or in the future, **When** the list is displayed,
   **Then** that todo shows no overdue indicator.
3. **Given** an incomplete todo with no due date set, **When** the list is displayed, **Then**
   that todo shows no overdue indicator.

---

### User Story 2 - Overdue Signal Reflects Completion State (Priority: P2)

As a todo application user, once I complete a task, I want it to stop being flagged as
overdue — even if I completed it after its due date — so the overdue signal only ever
represents work still outstanding.

**Why this priority**: Prevents the overdue indicator from becoming noisy or misleading once
work is done, preserving trust in the signal established by User Story 1.

**Independent Test**: Mark an overdue todo as complete and confirm the overdue indicator is
removed immediately, without reloading the page.

**Acceptance Scenarios**:

1. **Given** a todo currently flagged as overdue, **When** the user marks it complete, **Then**
   the overdue indicator disappears immediately.
2. **Given** a completed todo whose due date is in the past, **When** the list is displayed,
   **Then** that todo never shows an overdue indicator.

---

### User Story 3 - Overdue Signal Reacts to Due Date Changes (Priority: P3)

As a todo application user, when I edit a task's due date, I want the overdue indicator to
update immediately to reflect the new date, so the list is always accurate.

**Why this priority**: Ensures correctness over the lifetime of a task, not just at creation.
Lower priority than P1/P2 because editing is a secondary interaction relative to viewing and
completing tasks.

**Independent Test**: Edit an overdue todo's due date to a future date and confirm the
indicator disappears immediately; edit an on-time todo's due date to the past and confirm the
indicator appears immediately.

**Acceptance Scenarios**:

1. **Given** an overdue todo, **When** the user changes its due date to today or later,
   **Then** the overdue indicator disappears immediately.
2. **Given** a todo that is on time or has no due date, **When** the user changes its due date
   to a date before today, **Then** the overdue indicator appears immediately.
3. **Given** an overdue todo, **When** the user removes its due date entirely, **Then** the
   overdue indicator disappears immediately.

---

### Edge Cases

- What happens when the due date is exactly today? — Not considered overdue; a task remains
  "on time" through its entire due date, becoming overdue only starting the following day.
- What happens if the app stays open across midnight? — The overdue status is recalculated on
  the next page load or re-render; continuous real-time monitoring while idle is out of scope.
- What happens when a due date is cleared from an overdue item? — The overdue indicator is
  removed immediately, since an item with no due date can never be overdue.
- What happens when a completed item's due date is edited? — No overdue indicator is shown
  regardless, since completed items are never flagged as overdue.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST display a visual overdue indicator on any incomplete todo whose
  due date is strictly earlier than the current date.
- **FR-002**: The system MUST NOT display an overdue indicator on any todo marked complete,
  regardless of its due date.
- **FR-003**: The system MUST NOT display an overdue indicator on any todo that has no due date.
- **FR-004**: The system MUST NOT treat a todo due on the current date as overdue.
- **FR-005**: The system MUST update the overdue indicator immediately (without requiring a
  page reload) when a todo's completion status changes.
- **FR-006**: The system MUST update the overdue indicator immediately (without requiring a
  page reload) when a todo's due date is changed or removed.
- **FR-007**: The overdue indicator MUST be distinguishable through means other than colour
  alone (e.g., text label or icon), so it remains perceivable to users who cannot rely on
  colour cues.
- **FR-008**: The system MUST NOT change the existing display order of todos as a result of
  overdue status; overdue and non-overdue items remain in their existing creation-date order.
- **FR-009**: The system MUST recalculate overdue status only on render (e.g., page load, or a
  re-render triggered by a completion or due-date change) and MUST NOT poll or refresh purely
  due to elapsed time while the page is idle.

### Key Entities

- **Todo Item**: Represents a single task with a title, an optional due date, and a completion
  status. Its overdue state is a derived property: true only when the item is incomplete and
  its due date is earlier than the current date.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can identify every overdue item in their list within seconds of viewing it,
  without checking any date manually.
- **SC-002**: 100% of completed todos display no overdue indicator, regardless of due date.
- **SC-003**: 100% of todos without a due date display no overdue indicator.
- **SC-004**: The overdue indicator updates within the same interaction — no page reload — when
  a todo is completed, its due date changes, or its due date is cleared.

## Assumptions

- The application already stores a due date and completion status for each todo; no new data
  needs to be captured from the user beyond what currently exists.
- "Today" is based on the user's local device date and time.
- The overdue indicator's specific visual design (colour, icon, wording) is an implementation
  detail to be determined during planning, provided it satisfies the non-colour-alone
  requirement (FR-007).
- Desktop web usage is the primary context; no mobile-specific behaviour is required.

