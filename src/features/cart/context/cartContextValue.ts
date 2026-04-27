import { createContext } from 'react';
import { type CartLineItem } from '../types';

export interface CartContextValue {
  items: CartLineItem[];
  totalCount: number;
  totalPrice: number;
  addItem: (item: Omit<CartLineItem, 'lineId'>) => void;
  removeItem: (lineId: string) => void;
  clear: () => void;
}

export const CartContext = createContext<CartContextValue | null>(null);
