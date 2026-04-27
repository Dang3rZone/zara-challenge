import { Link } from 'react-router-dom';
import { formatPrice } from '@/shared/utils/formatPrice';
import { CartItem } from '../../components/CartItem/CartItem';
import { useCart } from '../../hooks/useCart';
import styles from './CartPage.module.scss';

export function CartPage() {
  const { items, totalCount, totalPrice, removeItem } = useCart();
  const isEmpty = items.length === 0;

  return (
    <section className={styles.page} aria-labelledby="cart-heading">
      <h1 id="cart-heading" className={styles.title}>
        CART ({totalCount})
      </h1>

      {!isEmpty && (
        <ul className={styles.list}>
          {items.map((item) => (
            <CartItem key={item.lineId} item={item} onRemove={removeItem} />
          ))}
        </ul>
      )}

      <footer className={styles.footer}>
        {!isEmpty && (
          <p className={styles.total}>
            <span className={styles.totalLabel}>TOTAL</span>
            <span className={styles.totalValue}>{formatPrice(totalPrice)}</span>
          </p>
        )}
        <div className={styles.actions}>
          <Link to="/" className={styles.continueButton}>
            CONTINUE SHOPPING
          </Link>
          {!isEmpty && (
            <button type="button" className={styles.payButton}>
              PAY
            </button>
          )}
        </div>
      </footer>
    </section>
  );
}
