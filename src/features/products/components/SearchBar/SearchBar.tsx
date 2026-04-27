import { useId, type ChangeEvent } from 'react';
import { X } from 'lucide-react';
import styles from './SearchBar.module.scss';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  resultsCount?: number;
  placeholder?: string;
}

export function SearchBar({
  value,
  onChange,
  resultsCount,
  placeholder = 'Search for a smartphone...',
}: SearchBarProps) {
  const inputId = useId();

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value);
  };

  const handleClear = () => {
    onChange('');
  };

  return (
    <div className={styles.wrapper}>
      <label htmlFor={inputId} className={styles.visuallyHidden}>
        Search smartphones
      </label>
      <div className={styles.inputRow}>
        <input
          id={inputId}
          type="text"
          className={styles.input}
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          autoComplete="off"
          spellCheck={false}
        />
        {value.length > 0 && (
          <button
            type="button"
            className={styles.clearButton}
            onClick={handleClear}
            aria-label="Clear search"
          >
            <X size={18} aria-hidden="true" strokeWidth={1.5} />
          </button>
        )}
      </div>
      {resultsCount !== undefined && (
        <p className={styles.count} aria-live="polite" aria-atomic="true">
          {resultsCount} RESULT{resultsCount === 1 ? '' : 'S'}
        </p>
      )}
    </div>
  );
}
