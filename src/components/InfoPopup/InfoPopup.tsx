import {
  useEffect,
  useRef,
  type FormEvent,
  type KeyboardEvent,
  type MouseEvent
} from 'react';
import type { InfoPopupVariant } from '../../types';
import styles from './InfoPopup.module.scss';

interface InfoPopupProps {
  title: string;
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: () => void;
  variant?: InfoPopupVariant;
}

const InfoPopup = ({
  title,
  isOpen,
  onClose,
  onConfirm,
  variant = 'alert'
}: InfoPopupProps) => {
  const dialogRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    previousFocusRef.current =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;

    const firstFocusableElement =
      dialogRef.current?.querySelector<HTMLElement>('button');
    firstFocusableElement?.focus();

    return () => {
      previousFocusRef.current?.focus();
    };
  }, [isOpen]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onClose();
  };

  const handleOverlayClick = (e: MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleDialogKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Escape') {
      onClose();
      return;
    }

    if (e.key !== 'Tab') {
      return;
    }

    const focusableElements = Array.from(
      dialogRef.current?.querySelectorAll<HTMLElement>(
        'button:not(:disabled)'
      ) ?? []
    );

    if (!focusableElements.length) {
      return;
    }

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (e.shiftKey && document.activeElement === firstElement) {
      e.preventDefault();
      lastElement.focus();
    }

    if (!e.shiftKey && document.activeElement === lastElement) {
      e.preventDefault();
      firstElement.focus();
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <>
      <div
        className={`${styles.overlay} ${styles.overlayVisible}`}
        onClick={handleOverlayClick}
        role='presentation'
      />
      <div
        ref={dialogRef}
        className={`${styles.infoPopup} ${styles.infoPopupOpened}`}
        role='dialog'
        aria-modal='true'
        aria-labelledby='info-popup-title'
        onKeyDown={handleDialogKeyDown}
      >
        <form className={styles.container} onSubmit={handleSubmit}>
          <h2 className={styles.title} id='info-popup-title'>
            {title}
          </h2>
          {variant === 'confirm' ? (
            <>
              <button type='button' onClick={onClose} className={styles.link}>
                вернуться назад
              </button>
              <button type='button' onClick={onConfirm} className={styles.btn}>
                Закрыть обращение
              </button>
            </>
          ) : (
            <button type='submit' className={styles.btn}>
              ОК
            </button>
          )}
        </form>
      </div>
    </>
  );
};

export default InfoPopup;
