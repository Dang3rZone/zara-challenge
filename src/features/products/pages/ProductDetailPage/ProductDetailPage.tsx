import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { useCart } from '@/features/cart/hooks/useCart';
import { formatPrice } from '@/shared/utils/formatPrice';
import { dedupeById } from '@/shared/utils/dedupeById';
import { ProductGrid } from '../../components/ProductGrid/ProductGrid';
import { useProduct } from '../../hooks/useProduct';
import { type ColorOption, type StorageOption } from '../../types';
import styles from './ProductDetailPage.module.scss';

export function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const state = useProduct(id);
  const { addItem } = useCart();

  const [selectedColor, setSelectedColor] = useState<ColorOption | null>(null);
  const [selectedStorage, setSelectedStorage] = useState<StorageOption | null>(null);

  const displayImage = useMemo(() => {
    if (state.status !== 'success') return null;
    if (selectedColor) return selectedColor.imageUrl;
    return state.data.colorOptions[0]?.imageUrl ?? null;
  }, [state, selectedColor]);

  if (state.status === 'loading' || state.status === 'idle') {
    return (
      <p className={styles.status} role="status">
        Loading…
      </p>
    );
  }

  if (state.status === 'error') {
    return (
      <div className={styles.status} role="alert">
        <p>Something went wrong.</p>
        <p className={styles.statusHint}>{state.error.message}</p>
      </div>
    );
  }

  const product = state.data;
  const canAddToCart = selectedColor !== null && selectedStorage !== null;
  const priceLabel = selectedStorage
    ? formatPrice(selectedStorage.price)
    : `From ${formatPrice(product.basePrice)}`;
  const similarItems = dedupeById(product.similarProducts).filter((p) => p.id !== product.id);

  const handleAddToCart = () => {
    if (!canAddToCart) return;
    addItem({
      productId: product.id,
      brand: product.brand,
      name: product.name,
      imageUrl: selectedColor.imageUrl,
      color: { name: selectedColor.name, hexCode: selectedColor.hexCode },
      storage: { capacity: selectedStorage.capacity, price: selectedStorage.price },
    });
  };

  return (
    <article className={styles.page}>
      <Link to="/" className={styles.backLink}>
        <ChevronLeft size={16} aria-hidden="true" strokeWidth={1.5} />
        <span>BACK</span>
      </Link>

      <div className={styles.mainGrid}>
        <div className={styles.imageWrapper}>
          {displayImage && (
            <img
              src={displayImage}
              alt={`${product.brand} ${product.name}`}
              className={styles.image}
            />
          )}
        </div>

        <div className={styles.details}>
          <header className={styles.header}>
            <h1 className={styles.name}>{product.name.toUpperCase()}</h1>
            <p className={styles.price}>{priceLabel}</p>
          </header>

          {product.storageOptions.length > 0 && (
            <fieldset className={styles.fieldset}>
              <legend className={styles.legend}>STORAGE ¿HOW MUCH SPACE DO YOU NEED?</legend>
              <div className={styles.storageOptions}>
                {product.storageOptions.map((option) => (
                  <button
                    key={option.capacity}
                    type="button"
                    className={styles.storageOption}
                    aria-pressed={selectedStorage?.capacity === option.capacity}
                    onClick={() => setSelectedStorage(option)}
                  >
                    {option.capacity}
                  </button>
                ))}
              </div>
            </fieldset>
          )}

          {product.colorOptions.length > 0 && (
            <fieldset className={styles.fieldset}>
              <legend className={styles.legend}>COLOR. PICK YOUR FAVOURITE.</legend>
              <div className={styles.colorOptions}>
                {product.colorOptions.map((option) => (
                  <button
                    key={option.name}
                    type="button"
                    className={styles.colorOption}
                    aria-pressed={selectedColor?.name === option.name}
                    aria-label={option.name}
                    onClick={() => setSelectedColor(option)}
                  >
                    <span className={styles.swatch} style={{ backgroundColor: option.hexCode }} />
                  </button>
                ))}
              </div>
              {selectedColor && <p className={styles.selectedColorName}>{selectedColor.name}</p>}
            </fieldset>
          )}

          <button
            type="button"
            className={styles.addButton}
            onClick={handleAddToCart}
            disabled={!canAddToCart}
          >
            AÑADIR
          </button>
        </div>
      </div>

      <section className={styles.specs}>
        <h2 className={styles.sectionTitle}>SPECIFICATIONS</h2>
        <dl className={styles.specsList}>
          <SpecRow label="BRAND" value={product.brand} />
          <SpecRow label="NAME" value={product.name} />
          <SpecRow label="DESCRIPTION" value={product.description} />
          <SpecRow label="SCREEN" value={product.specs.screen} />
          <SpecRow label="RESOLUTION" value={product.specs.resolution} />
          <SpecRow label="PROCESSOR" value={product.specs.processor} />
          <SpecRow label="MAIN CAMERA" value={product.specs.mainCamera} />
          <SpecRow label="SELFIE CAMERA" value={product.specs.selfieCamera} />
          <SpecRow label="BATTERY" value={product.specs.battery} />
          <SpecRow label="OS" value={product.specs.os} />
          <SpecRow label="SCREEN REFRESH RATE" value={product.specs.screenRefreshRate} />
        </dl>
      </section>

      {similarItems.length > 0 && (
        <section className={styles.similar}>
          <h2 className={styles.sectionTitle}>SIMILAR ITEMS</h2>
          <ProductGrid products={similarItems} />
        </section>
      )}
    </article>
  );
}

function SpecRow({ label, value }: { label: string; value: string }) {
  return (
    <div className={styles.specRow}>
      <dt>{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}
