/**
 * Returns whether a todo is overdue: incomplete and due before today (local date).
 * @param {string|null|undefined} dueDate - ISO date string (YYYY-MM-DD)
 * @param {number|boolean} completed - 0/1 or true/false
 * @returns {boolean}
 */
export function isOverdue(dueDate, completed) {
  if (completed === 1 || completed === true) {
    return false;
  }

  if (!dueDate) {
    return false;
  }

  const today = new Date().toLocaleDateString('en-CA');
  return dueDate < today;
}
