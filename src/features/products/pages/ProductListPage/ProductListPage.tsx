import { useState } from 'react';
import { useDebouncedValue } from '@/shared/hooks/useDebouncedValue';
import { SearchBar } from '../../components/SearchBar/SearchBar';
import { ProductGrid } from '../../components/ProductGrid/ProductGrid';
// import { useProducts } from '../../hooks/useProducts';
import styles from './ProductListPage.module.scss';

export function ProductListPage() {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebouncedValue(query, 300);

  //   const state = useProducts({ search: debouncedQuery, limit: 20 });

  //   const products = state.status === 'success' ? state.data : [];
  //   const resultsCount = state.status === 'success' ? products.length : undefined;

  //   return (
  //     <section className={styles.page}>
  //       <SearchBar
  //         value={query}
  //         onChange={setQuery}
  //         {...(resultsCount !== undefined && { resultsCount })}
  //       />

  //       {state.status === 'loading' && (
  //         <p className={styles.status} role="status">
  //           Loading…
  //         </p>
  //       )}

  //       {state.status === 'error' && (
  //         <div className={styles.status} role="alert">
  //           <p>Something went wrong.</p>
  //           <p className={styles.statusHint}>{state.error.message}</p>
  //         </div>
  //       )}

  //       {state.status === 'success' && products.length === 0 && (
  //         <p className={styles.status}>No smartphones match your search.</p>
  //       )}

  //       {state.status === 'success' && products.length > 0 && <ProductGrid products={products} />}
  //     </section>
  //   );
}
