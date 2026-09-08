const DEFAULT_BASE_PATH = '/test-task-for-CarX-Technologies/';

export const BASENAME = import.meta.env.VITE_BASE_PATH || DEFAULT_BASE_PATH;

export const STORAGE_KEYS = {
  isLoggedIn: 'isLoggedIn',
  userLogin: 'userLogin',
  tickets: 'tickets',
  comments: 'comments'
} as const;

export const MAX_FILES = 5;
export const MAX_TEXT_LENGTH = 1000;
export const MAX_FILE_SIZE_MB = 2;
export const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
export const MAX_TOTAL_FILE_SIZE_MB = 8;
export const MAX_TOTAL_FILE_SIZE_BYTES = MAX_TOTAL_FILE_SIZE_MB * 1024 * 1024;

export const ALLOWED_FILE_TYPES = [
  { mime: 'image/jpeg', label: 'JPG' },
  { mime: 'image/png', label: 'PNG' },
  { mime: 'application/pdf', label: 'PDF' },
  { mime: 'text/plain', label: 'TXT' }
] as const;

export const ACCEPTED_FILE_TYPES = ALLOWED_FILE_TYPES.map(
  fileType => fileType.mime
).join(',');

export const ALLOWED_FILE_TYPE_LABELS = ALLOWED_FILE_TYPES.map(
  fileType => fileType.label
).join(', ');

export const DEMO_CREDENTIALS = {
  login: 'admin',
  password: 'admin'
} as const;

export const categories = [
  'Категория 1',
  'Категория 2',
  'Категория 3',
  'Категория 4',
  'Категория 5',
  'Категория 6',
  'Другое'
] as const;
