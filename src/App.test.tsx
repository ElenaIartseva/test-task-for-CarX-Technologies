import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './components/App/App';
import { AuthProvider } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext';

describe('App', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('redirects unauthenticated user to login page', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <AuthProvider>
          <NotificationProvider>
            <App />
          </NotificationProvider>
        </AuthProvider>
      </MemoryRouter>
    );

    expect(
      screen.getByRole('heading', { name: /вход в личный кабинет/i })
    ).toBeInTheDocument();
  });
});
