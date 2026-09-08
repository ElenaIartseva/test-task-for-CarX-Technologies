import {
  isUserLoggedIn,
  loginUser,
  logoutUser,
  getStoredTickets,
  getStoredComments,
  generateTicketId,
  saveComments,
  saveTickets,
  StorageQuotaError
} from './storage';
import { STORAGE_KEYS } from './constants';
import type { Ticket } from '../types';

describe('storage utils', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('loginUser sets isLoggedIn to true string', () => {
    loginUser('admin');
    expect(localStorage.getItem(STORAGE_KEYS.isLoggedIn)).toBe('true');
    expect(localStorage.getItem(STORAGE_KEYS.userLogin)).toBe('admin');
    expect(isUserLoggedIn()).toBe(true);
  });

  test('isUserLoggedIn returns false for legacy false value', () => {
    localStorage.setItem(STORAGE_KEYS.isLoggedIn, 'false');
    expect(isUserLoggedIn()).toBe(false);
  });

  test('logoutUser clears auth data', () => {
    loginUser('admin');
    localStorage.setItem('userPassword', 'secret');
    logoutUser();
    expect(isUserLoggedIn()).toBe(false);
    expect(localStorage.getItem(STORAGE_KEYS.userLogin)).toBeNull();
    expect(localStorage.getItem('userPassword')).toBeNull();
  });

  test('getStoredTickets returns empty array when storage is empty', () => {
    expect(getStoredTickets()).toEqual([]);
  });

  test('saveTickets and getStoredTickets work together', () => {
    const tickets: Ticket[] = [
      {
        id: 1,
        text: 'test',
        category: 'Cat',
        files: [],
        createdAt: '08.09.2026, 11:00:00',
        status: 'open'
      }
    ];
    saveTickets(tickets);
    expect(getStoredTickets()).toEqual(tickets);
  });

  test('getStoredTickets returns empty array for invalid json', () => {
    localStorage.setItem(STORAGE_KEYS.tickets, '{invalid');
    expect(getStoredTickets()).toEqual([]);
  });

  test('getStoredTickets returns empty array for invalid data shape', () => {
    localStorage.setItem(STORAGE_KEYS.tickets, JSON.stringify({ id: 1 }));
    expect(getStoredTickets()).toEqual([]);
  });

  test('getStoredTickets filters out invalid ticket items', () => {
    const validTicket: Ticket = {
      id: 1,
      text: 'test',
      category: 'Cat',
      files: [],
      createdAt: '08.09.2026, 11:00:00',
      status: 'open'
    };

    localStorage.setItem(
      STORAGE_KEYS.tickets,
      JSON.stringify([validTicket, { id: 2 }])
    );

    expect(getStoredTickets()).toEqual([validTicket]);
  });

  test('getStoredTickets migrates legacy blocked ticket status', () => {
    localStorage.setItem(
      STORAGE_KEYS.tickets,
      JSON.stringify([
        {
          id: 1,
          text: 'test',
          category: 'Cat',
          files: [],
          blocked: true
        }
      ])
    );

    expect(getStoredTickets()).toEqual([
      {
        id: 1,
        text: 'test',
        category: 'Cat',
        files: [],
        createdAt: 'Дата неизвестна',
        status: 'closed'
      }
    ]);
  });

  test('saveComments and getStoredComments work together', () => {
    const comments = [
      { id: 1, text: 'comment', date: '01.01.2026', ticketId: 1 }
    ];

    saveComments(comments);
    expect(getStoredComments()).toEqual(comments);
  });

  test('getStoredComments filters out invalid comment items', () => {
    const validComment = {
      id: 1,
      text: 'comment',
      date: '01.01.2026',
      ticketId: 1
    };

    localStorage.setItem(
      STORAGE_KEYS.comments,
      JSON.stringify([validComment, { text: 'broken' }])
    );

    expect(getStoredComments()).toEqual([validComment]);
  });

  test('generateTicketId returns a safe numeric id', () => {
    const id = generateTicketId();

    expect(Number.isSafeInteger(id)).toBe(true);
    expect(id).toBeGreaterThan(0);
  });

  test('saveTickets throws StorageQuotaError when storage is full', () => {
    const setItem = vi.spyOn(Storage.prototype, 'setItem');
    setItem.mockImplementation(() => {
      const error = new DOMException('Quota exceeded', 'QuotaExceededError');
      throw error;
    });

    expect(() =>
      saveTickets([
        {
          id: 1,
          text: 't',
          category: 'c',
          files: [],
          createdAt: '08.09.2026, 11:00:00',
          status: 'open'
        }
      ])
    ).toThrow(StorageQuotaError);

    setItem.mockRestore();
  });
});
