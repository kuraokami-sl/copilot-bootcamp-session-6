# Data Model: Overdue Todo Items

**Date**: 2026-08-10
**Feature**: specs/001-overdue-todo-items

## Entities

### Todo (existing — no schema changes)

| Field | Type | Constraints | Notes |
|-------|------|-------------|-------|
| `id` | integer | Primary key, auto-increment | — |
| `title` | string | Required, max 255 chars | — |
| `dueDate` | string \| null | Optional, format `YYYY-MM-DD` | Stored/returned verbatim from HTML date input |
| `completed` | integer (0\|1) | Default 0 | Backend uses SQLite integer; frontend compares `=== 1` |
| `createdAt` | string | ISO datetime | Used for default sort order (newest first) |

No new fields, tables, or migrations are introduced by this feature.

---

## Derived State: `isOverdue`

This is a **computed value** — it is never stored. It is derived at render time from
existing todo fields, satisfying FR-001 through FR-004.

**Signature**: `isOverdue(dueDate: string | null, completed: number | boolean): boolean`

**Rules**:

| Condition | Result |
|-----------|--------|
| `completed` is truthy (1 or `true`) | `false` — completed items are never overdue (FR-002) |
| `dueDate` is null or empty string | `false` — no due date means no overdue state (FR-003) |
| `dueDate < today` (local date string, `YYYY-MM-DD`) | `true` — item is overdue (FR-001) |
| `dueDate >= today` | `false` — on time or due today, never overdue (FR-004) |

**Today's date** is computed as `new Date().toLocaleDateString('en-CA')` which returns
`YYYY-MM-DD` in the client's local timezone, matching the format of stored `dueDate` values.

Recalculation happens only when the component renders (page load, or a re-render triggered
by a completion toggle or due-date edit) — no timers or polling are introduced (FR-009).
Overdue status never changes the list's sort order (FR-008); it is a purely visual
annotation on top of the existing creation-date ordering.

---

## State Transitions

```
[incomplete, no due date]  →  never overdue
[incomplete, future date]  →  not overdue
[incomplete, today]        →  not overdue  (due today ≠ overdue)
[incomplete, past date]    →  OVERDUE  ◄── visual indicator shown
[complete, any date]       →  never overdue  (even if past)
```

Note: none of these transitions change a todo's position in the list (FR-008); the list
remains sorted by `createdAt` regardless of overdue state.

Transitions that affect the overdue indicator (map to User Stories 2 and 3, FR-005/FR-006):

- User marks todo **complete** → indicator removed immediately (same render cycle) — US2
- User changes due date to **today or future** → indicator removed immediately — US3
- User changes due date to **past date** → indicator shown immediately — US3
- User **removes** due date → indicator removed immediately — US3
- Page **loads/reloads** → indicator reflects current local date at load time — US1
