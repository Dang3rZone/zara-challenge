import { describe, it, expect } from 'vitest';
import { cartReducer, INITIAL_CART_STATE, selectTotalCount, selectTotalPrice } from './cartReducer';
import { type CartLineItem } from '../types';

const makeItem = (overrides: Partial<CartLineItem> = {}): CartLineItem => ({
  lineId: 'line-1',
  productId: 'p1',
  brand: 'Apple',
  name: 'iPhone 15',
  imageUrl: 'https://example.com/img.png',
  color: { name: 'Black', hexCode: '#000' },
  storage: { capacity: '128GB', price: 959 },
  ...overrides,
});

describe('cartReducer', () => {
  it('starts empty', () => {
    expect(INITIAL_CART_STATE).toEqual({ items: [] });
  });

  it('hydrates from persisted items', () => {
    const items = [makeItem()];
    const next = cartReducer(INITIAL_CART_STATE, {
      type: 'cart/hydrated',
      payload: { items },
    });
    expect(next.items).toEqual(items);
  });

  it('appends a new line for each add, even for identical variants', () => {
    const item = { ...makeItem() };
    const { lineId: _ignored, ...itemWithoutId } = item;

    const afterFirst = cartReducer(INITIAL_CART_STATE, {
      type: 'cart/itemAdded',
      payload: { item: itemWithoutId, lineId: 'a' },
    });
    const afterSecond = cartReducer(afterFirst, {
      type: 'cart/itemAdded',
      payload: { item: itemWithoutId, lineId: 'b' },
    });

    expect(afterSecond.items).toHaveLength(2);
    expect(afterSecond.items.map((i) => i.lineId)).toEqual(['a', 'b']);
  });

  it('removes by lineId', () => {
    const state = {
      items: [makeItem({ lineId: 'a' }), makeItem({ lineId: 'b' })],
    };
    const next = cartReducer(state, {
      type: 'cart/itemRemoved',
      payload: { lineId: 'a' },
    });
    expect(next.items).toHaveLength(1);
    expect(next.items[0]?.lineId).toBe('b');
  });

  it('ignores removal of a non-existent lineId', () => {
    const state = { items: [makeItem({ lineId: 'a' })] };
    const next = cartReducer(state, {
      type: 'cart/itemRemoved',
      payload: { lineId: 'zzz' },
    });
    expect(next.items).toHaveLength(1);
  });

  it('clears the cart', () => {
    const state = { items: [makeItem()] };
    const next = cartReducer(state, { type: 'cart/cleared' });
    expect(next).toEqual(INITIAL_CART_STATE);
  });
});

describe('cart selectors', () => {
  it('totals by item count', () => {
    const state = { items: [makeItem({ lineId: 'a' }), makeItem({ lineId: 'b' })] };
    expect(selectTotalCount(state)).toBe(2);
  });

  it('sums prices across lines', () => {
    const state = {
      items: [
        makeItem({ lineId: 'a', storage: { capacity: '128GB', price: 959 } }),
        makeItem({ lineId: 'b', storage: { capacity: '256GB', price: 1099 } }),
      ],
    };
    expect(selectTotalPrice(state)).toBe(2058);
  });

  it('returns zero for an empty cart', () => {
    expect(selectTotalPrice(INITIAL_CART_STATE)).toBe(0);
    expect(selectTotalCount(INITIAL_CART_STATE)).toBe(0);
  });
});
