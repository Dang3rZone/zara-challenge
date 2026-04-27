import { Link } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';
import { useCart } from '@/features/cart/hooks/useCart';
import styles from './Navbar.module.scss';

export function Navbar() {
  const { totalCount } = useCart();

  return (
    <header className={styles.header}>
      <nav className={styles.nav} aria-label="Primary">
        <Link to="/" className={styles.logoLink} aria-label="MBST — go to home">
          <span className={styles.logoMark} aria-hidden="true" />
          <span className={styles.logoText}>MBST</span>
        </Link>

        <Link
          to="/cart"
          className={styles.cartLink}
          aria-label={`Cart, ${totalCount} ${totalCount === 1 ? 'item' : 'items'}`}
        >
          <ShoppingBag size={20} aria-hidden="true" strokeWidth={1.5} />
          <span className={styles.cartCount} aria-hidden="true">
            {totalCount}
          </span>
        </Link>
      </nav>
    </header>
  );
}
