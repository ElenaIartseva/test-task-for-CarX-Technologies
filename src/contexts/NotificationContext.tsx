import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode
} from 'react';
import InfoPopup from '../components/InfoPopup/InfoPopup';
import type { InfoPopupVariant } from '../types';

interface NotificationContextValue {
  showInfo: (text: string) => void;
  showConfirm: (text: string, onSubmit: () => void) => void;
  closeInfoPopup: () => void;
}

const NotificationContext = createContext<NotificationContextValue | null>(
  null
);

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [infoPopup, setInfoPopup] = useState(false);
  const [infoPopupText, setInfoPopupText] = useState('');
  const [infoPopupVariant, setInfoPopupVariant] =
    useState<InfoPopupVariant>('alert');
  const [infoPopupOnSubmit, setInfoPopupOnSubmit] = useState<
    (() => void) | null
  >(null);

  const closeInfoPopup = useCallback(() => {
    setInfoPopup(false);
    setInfoPopupOnSubmit(null);
  }, []);

  const showInfo = useCallback((text: string) => {
    setInfoPopupText(text);
    setInfoPopupVariant('alert');
    setInfoPopupOnSubmit(null);
    setInfoPopup(true);
  }, []);

  const showConfirm = useCallback((text: string, onSubmit: () => void) => {
    setInfoPopupText(text);
    setInfoPopupVariant('confirm');
    setInfoPopupOnSubmit(() => onSubmit);
    setInfoPopup(true);
  }, []);

  const handleInfoPopupSubmit = useCallback(() => {
    infoPopupOnSubmit?.();
    closeInfoPopup();
  }, [infoPopupOnSubmit, closeInfoPopup]);

  const value = useMemo(
    () => ({
      showInfo,
      showConfirm,
      closeInfoPopup
    }),
    [showInfo, showConfirm, closeInfoPopup]
  );

  return (
    <NotificationContext.Provider value={value}>
      {children}
      <InfoPopup
        title={infoPopupText}
        isOpen={infoPopup}
        variant={infoPopupVariant}
        onClose={closeInfoPopup}
        onConfirm={
          infoPopupVariant === 'confirm' ? handleInfoPopupSubmit : undefined
        }
      />
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);

  if (!context) {
    throw new Error('useNotification must be used within NotificationProvider');
  }

  return context;
};
