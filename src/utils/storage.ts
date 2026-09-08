import type { Comment, Ticket, TicketStatus } from '../types';
import { STORAGE_KEYS } from './constants';

export class StorageQuotaError extends Error {
  constructor(message = 'Недостаточно места в хранилище браузера.') {
    super(message);
    this.name = 'StorageQuotaError';
  }
}

const saveToStorage = (key: string, value: string) => {
  try {
    localStorage.setItem(key, value);
  } catch (error) {
    if (error instanceof DOMException && error.name === 'QuotaExceededError') {
      throw new StorageQuotaError();
    }
    throw error;
  }
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const isFiniteNumber = (value: unknown): value is number =>
  typeof value === 'number' && Number.isFinite(value);

const isTicketFile = (value: unknown): value is Ticket['files'][number] =>
  isRecord(value) &&
  typeof value.name === 'string' &&
  (value.data === undefined || typeof value.data === 'string');

const isTicketStatus = (value: unknown): value is TicketStatus =>
  value === 'open' || value === 'closed';

const normalizeTicket = (value: unknown): Ticket | null => {
  if (
    !isRecord(value) ||
    !isFiniteNumber(value.id) ||
    typeof value.category !== 'string' ||
    typeof value.text !== 'string' ||
    !Array.isArray(value.files) ||
    !value.files.every(isTicketFile)
  ) {
    return null;
  }

  const status = isTicketStatus(value.status)
    ? value.status
    : value.blocked === true
      ? 'closed'
      : value.blocked === false
        ? 'open'
        : null;

  if (!status) {
    return null;
  }

  return {
    id: value.id,
    category: value.category,
    text: value.text,
    files: value.files,
    createdAt:
      typeof value.createdAt === 'string' ? value.createdAt : 'Дата неизвестна',
    status
  };
};

const isComment = (value: unknown): value is Comment =>
  isRecord(value) &&
  (value.id === undefined || isFiniteNumber(value.id)) &&
  typeof value.text === 'string' &&
  typeof value.date === 'string' &&
  isFiniteNumber(value.ticketId);

const getStoredArray = <T>(
  key: string,
  normalizeItem: (value: unknown) => T | null
): T[] => {
  try {
    const data = localStorage.getItem(key);
    if (!data) {
      return [];
    }

    const parsed: unknown = JSON.parse(data);
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.reduce<T[]>((items, item) => {
      const normalizedItem = normalizeItem(item);
      return normalizedItem ? [...items, normalizedItem] : items;
    }, []);
  } catch {
    return [];
  }
};

export const isUserLoggedIn = () =>
  localStorage.getItem(STORAGE_KEYS.isLoggedIn) === 'true';

export const loginUser = (login: string) => {
  localStorage.setItem(STORAGE_KEYS.isLoggedIn, 'true');
  localStorage.setItem(STORAGE_KEYS.userLogin, login);
};

export const logoutUser = () => {
  localStorage.removeItem(STORAGE_KEYS.isLoggedIn);
  localStorage.removeItem(STORAGE_KEYS.userLogin);
  localStorage.removeItem('userPassword');
};

export const getStoredTickets = (): Ticket[] => {
  return getStoredArray(STORAGE_KEYS.tickets, normalizeTicket);
};

export const saveTickets = (tickets: Ticket[]) => {
  saveToStorage(STORAGE_KEYS.tickets, JSON.stringify(tickets));
};

export const getStoredComments = (): Comment[] => {
  return getStoredArray(STORAGE_KEYS.comments, item =>
    isComment(item) ? item : null
  );
};

export const saveComments = (comments: Comment[]) => {
  saveToStorage(STORAGE_KEYS.comments, JSON.stringify(comments));
};

export const readFileAsDataUrl = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });

export const generateStorageId = () => {
  const randomValue = new Uint32Array(1);
  crypto.getRandomValues(randomValue);

  return Date.now() * 1000 + (randomValue[0] % 1000);
};

export const generateTicketId = generateStorageId;
