import { describe, it, expect } from 'vitest';
import { dedupeById } from './dedupeById';

describe('dedupeById', () => {
  it('returns an empty array unchanged', () => {
    expect(dedupeById([])).toEqual([]);
  });

  it('returns the same items when ids are already unique', () => {
    const items = [{ id: 'a' }, { id: 'b' }, { id: 'c' }];
    expect(dedupeById(items)).toEqual(items);
  });

  it('keeps the first occurrence and drops later duplicates', () => {
    const items = [
      { id: 'a', label: 'first-a' },
      { id: 'b', label: 'first-b' },
      { id: 'a', label: 'second-a' },
      { id: 'c', label: 'first-c' },
      { id: 'b', label: 'second-b' },
    ];
    expect(dedupeById(items)).toEqual([
      { id: 'a', label: 'first-a' },
      { id: 'b', label: 'first-b' },
      { id: 'c', label: 'first-c' },
    ]);
  });

  it('does not mutate the input', () => {
    const items = [{ id: 'a' }, { id: 'a' }];
    const before = [...items];
    dedupeById(items);
    expect(items).toEqual(before);
  });
});
