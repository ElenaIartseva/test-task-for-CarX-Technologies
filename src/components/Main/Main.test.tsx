import type { Ticket } from '../../types';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Main from './Main';
import {
  getStoredTickets,
  saveTickets,
  StorageQuotaError
} from '../../utils/storage';
import { renderWithProviders } from '../../test/testUtils';

vi.mock('../../utils/storage', async importOriginal => {
  const actual = await importOriginal<typeof import('../../utils/storage')>();
  return {
    ...actual,
    generateTicketId: () => 123,
    readFileAsDataUrl: vi
      .fn()
      .mockResolvedValue('data:text/plain;base64,dGVzdA=='),
    saveTickets: vi.fn((tickets: Ticket[]) => actual.saveTickets(tickets))
  };
});

describe('Main', () => {
  beforeEach(async () => {
    localStorage.clear();
    const actual = await vi.importActual<typeof import('../../utils/storage')>(
      '../../utils/storage'
    );
    vi.mocked(saveTickets).mockImplementation(actual.saveTickets);
  });

  test('renders ticket creation form', () => {
    renderWithProviders(<Main />);

    expect(
      screen.getByRole('heading', { name: /создать новое обращение/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /отправить/i })
    ).toBeInTheDocument();
  });

  test('creates a new ticket', async () => {
    const user = userEvent.setup();

    renderWithProviders(<Main />);

    await user.selectOptions(
      screen.getByRole('combobox'),
      screen.getByRole('option', { name: 'Категория 1' })
    );
    await user.type(
      screen.getByPlaceholderText('Текст до 1 000 символов'),
      'Тестовое обращение'
    );
    await user.click(screen.getByRole('button', { name: /отправить/i }));

    expect(
      screen.getByText('Обращение успешно отправлено.')
    ).toBeInTheDocument();

    const tickets = getStoredTickets();
    expect(tickets).toHaveLength(1);
    expect(tickets[0]).toMatchObject({
      id: 123,
      category: 'Категория 1',
      text: 'Тестовое обращение',
      status: 'open'
    });
    expect(tickets[0].createdAt).toEqual(expect.any(String));
  });

  test('shows error when storage quota is exceeded', async () => {
    const user = userEvent.setup();

    vi.mocked(saveTickets).mockImplementation(() => {
      throw new StorageQuotaError();
    });

    renderWithProviders(<Main />);

    await user.selectOptions(
      screen.getByRole('combobox'),
      screen.getByRole('option', { name: 'Категория 1' })
    );
    await user.type(
      screen.getByPlaceholderText('Текст до 1 000 символов'),
      'Тестовое обращение'
    );
    await user.click(screen.getByRole('button', { name: /отправить/i }));

    expect(
      screen.getByText(/недостаточно места в хранилище браузера/i)
    ).toBeInTheDocument();
  });
});
