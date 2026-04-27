import { formatPrice } from '@/shared/utils/formatPrice';
import { type CartLineItem } from '../../types';
import styles from './CartItem.module.scss';

interface CartItemProps {
  item: CartLineItem;
  onRemove: (lineId: string) => void;
}

export function CartItem({ item, onRemove }: CartItemProps) {
  return (
    <li className={styles.item}>
      <div className={styles.imageWrapper}>
        <img src={item.imageUrl} alt="" className={styles.image} loading="lazy" />
      </div>

      <div className={styles.info}>
        <p className={styles.name}>{item.name.toUpperCase()}</p>
        <p className={styles.variant}>
          {item.storage.capacity.toUpperCase()} | {item.color.name.toUpperCase()}
        </p>
        <p className={styles.price}>{formatPrice(item.storage.price)}</p>
        <button
          type="button"
          className={styles.remove}
          onClick={() => onRemove(item.lineId)}
          aria-label={`Remove ${item.brand} ${item.name} from cart`}
        >
          Eliminar
        </button>
      </div>
    </li>
  );
}
