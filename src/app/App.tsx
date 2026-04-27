import { RouterProvider } from 'react-router-dom';
import { CartProvider } from '@/features/cart/context/CartContext';
import { router } from './router';

export function App() {
  return (
    <CartProvider>
      <RouterProvider router={router} />
    </CartProvider>
  );
}
