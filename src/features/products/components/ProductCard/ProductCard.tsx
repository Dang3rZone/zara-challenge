import { Link } from 'react-router-dom';
import { formatPrice } from '@/shared/utils/formatPrice';
import { type ProductListItem } from '../../types';
import styles from './ProductCard.module.scss';

interface ProductCardProps {
  product: ProductListItem;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Link
      to={`/product/${product.id}`}
      className={styles.card}
      aria-label={`${product.brand} ${product.name}, ${formatPrice(product.basePrice)}`}
    >
      <div className={styles.imageWrapper}>
        <img
          src={product.imageUrl}
          alt=""
          className={styles.image}
          loading="lazy"
          decoding="async"
        />
      </div>
      <div className={styles.meta}>
        <p className={styles.brand}>{product.brand.toUpperCase()}</p>
        <div className={styles.row}>
          <span className={styles.name}>{product.name.toUpperCase()}</span>
          <span className={styles.price}>{formatPrice(product.basePrice)}</span>
        </div>
      </div>
    </Link>
  );
}
