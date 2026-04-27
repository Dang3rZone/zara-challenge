import { useContext } from 'react';
import { CartContext, type CartContextValue } from '../context/cartContextValue';

/**
 * Access the cart context. Throws if used outside `CartProvider` —
 * this surfaces wiring mistakes at dev time instead of producing
 * silent `undefined`s deeper in the tree.
 */
export function useCart(): CartContextValue {
  const value = useContext(CartContext);
  if (value === null) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return value;
}
