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
existing todo fields.

**Signature**: `isOverdue(dueDate: string | null, completed: number | boolean): boolean`

**Rules**:

| Condition | Result |
|-----------|--------|
| `completed` is truthy (1 or `true`) | `false` — completed items are never overdue |
| `dueDate` is null or empty string | `false` — no due date means no overdue state |
| `dueDate < today` (local date string, `YYYY-MM-DD`) | `true` — item is overdue |
| `dueDate >= today` | `false` — on time or future |

**Today's date** is computed as `new Date().toLocaleDateString('en-CA')` which returns
`YYYY-MM-DD` in the client's local timezone, matching the format of stored `dueDate` values.

---

## State Transitions

```
[incomplete, no due date]  →  never overdue
[incomplete, future date]  →  not overdue
[incomplete, today]        →  not overdue  (due today ≠ overdue)
[incomplete, past date]    →  OVERDUE  ◄── visual indicator shown
[complete, any date]       →  never overdue  (even if past)
```

Transitions that affect the overdue indicator:

- User marks todo **complete** → indicator removed immediately (same render cycle)
- User changes due date to **today or future** → indicator removed immediately
- User changes due date to **past date** → indicator shown immediately
- User **removes** due date → indicator removed immediately
- Page **loads/reloads** → indicator reflects current local date at load time
