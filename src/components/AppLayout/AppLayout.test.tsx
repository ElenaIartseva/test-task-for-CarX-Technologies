import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import AppLayout from './AppLayout';
import { AuthProvider } from '../../contexts/AuthContext';
import { NotificationProvider } from '../../contexts/NotificationContext';
import { TicketsProvider } from '../../contexts/TicketsContext';
import { loginUser } from '../../utils/storage';

describe('AppLayout', () => {
  beforeEach(() => {
    localStorage.clear();
    loginUser('admin');
  });

  test('shows user login and logout button', async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <AuthProvider>
          <NotificationProvider>
            <TicketsProvider>
              <Routes>
                <Route element={<AppLayout />}>
                  <Route path='/' element={<div>Page content</div>} />
                </Route>
              </Routes>
            </TicketsProvider>
          </NotificationProvider>
        </AuthProvider>
      </MemoryRouter>
    );

    expect(screen.getByText(/вы вошли как admin/i)).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /выйти/i }));
    expect(screen.queryByText(/вы вошли как admin/i)).not.toBeInTheDocument();
  });
});
