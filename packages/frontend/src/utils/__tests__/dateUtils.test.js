import { isOverdue } from '../dateUtils';

describe('isOverdue', () => {
  const getLocalDateString = (offsetDays) => {
    const date = new Date();
    date.setDate(date.getDate() + offsetDays);
    return date.toLocaleDateString('en-CA');
  };

  it('returns true for a past due date on an incomplete todo', () => {
    expect(isOverdue(getLocalDateString(-1), 0)).toBe(true);
  });

  it('returns false for a past due date on a completed todo', () => {
    expect(isOverdue(getLocalDateString(-1), 1)).toBe(false);
  });

  it('returns false for a past due date on a completed todo (boolean true)', () => {
    expect(isOverdue(getLocalDateString(-1), true)).toBe(false);
  });

  it('returns false for a due date of today', () => {
    expect(isOverdue(getLocalDateString(0), 0)).toBe(false);
  });

  it('returns false for a future due date', () => {
    expect(isOverdue(getLocalDateString(1), 0)).toBe(false);
  });

  it('returns false when dueDate is null', () => {
    expect(isOverdue(null, 0)).toBe(false);
  });

  it('returns false when dueDate is an empty string', () => {
    expect(isOverdue('', 0)).toBe(false);
  });

  it('returns false when dueDate is undefined', () => {
    expect(isOverdue(undefined, 0)).toBe(false);
  });
});
