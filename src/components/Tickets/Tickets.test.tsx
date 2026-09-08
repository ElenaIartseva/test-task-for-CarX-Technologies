import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import Tickets from './Tickets';
import AppLayout from '../AppLayout/AppLayout';
import { AuthProvider } from '../../contexts/AuthContext';
import { NotificationProvider } from '../../contexts/NotificationContext';
import { TicketsProvider } from '../../contexts/TicketsContext';
import { loginUser, saveTickets } from '../../utils/storage';

const renderTickets = (ticketId = 1) => {
  loginUser('admin');

  return render(
    <MemoryRouter initialEntries={[`/tickets/${ticketId}`]}>
      <AuthProvider>
        <NotificationProvider>
          <TicketsProvider>
            <Routes>
              <Route element={<AppLayout />}>
                <Route path='/tickets/:id' element={<Tickets />} />
              </Route>
              <Route path='/404' element={<div>404 page</div>} />
            </Routes>
          </TicketsProvider>
        </NotificationProvider>
      </AuthProvider>
    </MemoryRouter>
  );
};

describe('Tickets', () => {
  beforeEach(() => {
    localStorage.clear();
    saveTickets([
      {
        id: 1,
        category: 'Категория 1',
        text: 'Проблема с приложением',
        files: [],
        createdAt: '08.09.2026, 11:00:00',
        status: 'open'
      }
    ]);
  });

  test('displays ticket information', () => {
    renderTickets();

    expect(
      screen.getByRole('heading', { name: /информация об обращении: 1/i })
    ).toBeInTheDocument();
    expect(
      screen.getAllByText(/проблема с приложением/i).length
    ).toBeGreaterThan(0);
    expect(screen.getAllByText(/статус:/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/открыт/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/комментариев пока нет/i)).toBeInTheDocument();
  });

  test('adds a comment to the ticket', async () => {
    const user = userEvent.setup();
    renderTickets();

    await user.type(
      screen.getByPlaceholderText('Текст до 1 000 символов'),
      'Новый комментарий'
    );
    await user.click(
      screen.getByRole('button', { name: /добавить комментарий/i })
    );

    expect(screen.getByText('Новый комментарий')).toBeInTheDocument();
  });

  test('blocks ticket after confirmation', async () => {
    const user = userEvent.setup();
    renderTickets();

    const form = screen
      .getByRole('button', { name: /добавить комментарий/i })
      .closest('form');

    await user.click(
      within(form!).getByRole('button', { name: /^закрыть обращение$/i })
    );

    const dialog = screen.getByRole('dialog');
    await user.click(
      within(dialog).getByRole('button', { name: /^закрыть обращение$/i })
    );

    expect(
      screen.getByText(/обращение закрыто для редактирования/i)
    ).toBeInTheDocument();
  });

  test('redirects to 404 for unknown ticket', () => {
    renderTickets(999);

    expect(screen.getByText('404 page')).toBeInTheDocument();
  });
});
