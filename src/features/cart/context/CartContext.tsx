import { useCallback, useEffect, useMemo, useReducer, useRef, type ReactNode } from 'react';
import { type CartLineItem, type CartState } from '../types';
import { cartReducer, INITIAL_CART_STATE, selectTotalCount, selectTotalPrice } from './cartReducer';
import { loadCartState, saveCartState } from './cartStorage';
import { CartContext, type CartContextValue } from './cartContextValue';

interface CartProviderProps {
  children: ReactNode;
  /** Test seam — bypasses localStorage when provided. */
  initialState?: CartState;
}

/**
 * Generate a stable id for a new cart line. `crypto.randomUUID` is
 * available in all evergreen browsers and JSDOM 22+.
 */
function createLineId(): string {
  return crypto.randomUUID();
}

export function CartProvider({ children, initialState }: CartProviderProps) {
  const [state, dispatch] = useReducer(cartReducer, initialState ?? INITIAL_CART_STATE, (seed) =>
    initialState ? seed : loadCartState(),
  );

  const hasHydratedRef = useRef(false);

  useEffect(() => {
    if (!hasHydratedRef.current) {
      hasHydratedRef.current = true;
      return;
    }
    saveCartState(state);
  }, [state]);

  const addItem = useCallback((item: Omit<CartLineItem, 'lineId'>) => {
    dispatch({
      type: 'cart/itemAdded',
      payload: { item, lineId: createLineId() },
    });
  }, []);

  const removeItem = useCallback((lineId: string) => {
    dispatch({ type: 'cart/itemRemoved', payload: { lineId } });
  }, []);

  const clear = useCallback(() => {
    dispatch({ type: 'cart/cleared' });
  }, []);

  const value = useMemo<CartContextValue>(
    () => ({
      items: state.items,
      totalCount: selectTotalCount(state),
      totalPrice: selectTotalPrice(state),
      addItem,
      removeItem,
      clear,
    }),
    [state, addItem, removeItem, clear],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
