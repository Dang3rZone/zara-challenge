import { lazy, Suspense } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { Layout } from './Layout';
import { RouteFallback } from './RouteFallback';

const ProductListPage = lazy(() =>
  import('@/features/products/pages/ProductListPage/ProductListPage').then((m) => ({
    default: m.ProductListPage,
  })),
);
const ProductDetailPage = lazy(() =>
  import('@/features/products/pages/ProductDetailPage/ProductDetailPage').then((m) => ({
    default: m.ProductDetailPage,
  })),
);
const CartPage = lazy(() =>
  import('@/features/cart/pages/CartPage/CartPage').then((m) => ({
    default: m.CartPage,
  })),
);

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Suspense fallback={<RouteFallback />}>{<ProductListPage />}</Suspense>,
      },
      {
        path: 'product/:id',
        element: <Suspense fallback={<RouteFallback />}>{<ProductDetailPage />}</Suspense>,
      },
      {
        path: 'cart',
        element: <Suspense fallback={<RouteFallback />}>{<CartPage />}</Suspense>,
      },
      { path: '*', element: <Navigate to="/" replace /> },
    ],
  },
]);
