import { type ProductListItem } from '../../types';
import { ProductCard } from '../ProductCard/ProductCard';
import styles from './ProductGrid.module.scss';

interface ProductGridProps {
  products: ProductListItem[];
}

export function ProductGrid({ products }: ProductGridProps) {
  return (
    <ul className={styles.grid}>
      {products.map((product) => (
        <li key={product.id}>
          <ProductCard product={product} />
        </li>
      ))}
    </ul>
  );
}
