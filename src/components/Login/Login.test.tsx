import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Login from './Login';
import { renderWithProviders } from '../../test/testUtils';
import { isUserLoggedIn } from '../../utils/storage';

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async importOriginal => {
  const actual = await importOriginal<typeof import('react-router-dom')>();
  return {
    ...actual,
    useNavigate: () => mockNavigate
  };
});

describe('Login', () => {
  beforeEach(() => {
    localStorage.clear();
    mockNavigate.mockClear();
  });

  test('renders login form', () => {
    renderWithProviders(<Login />);

    expect(
      screen.getByRole('heading', { name: /вход в личный кабинет/i })
    ).toBeInTheDocument();
    expect(screen.getByLabelText('Логин')).toBeInTheDocument();
    expect(screen.getByLabelText('Пароль')).toBeInTheDocument();
  });

  test('logs in with valid credentials', async () => {
    const user = userEvent.setup();

    renderWithProviders(<Login />);

    await user.type(screen.getByLabelText('Логин'), 'admin');
    await user.type(screen.getByLabelText('Пароль'), 'admin');
    await user.click(screen.getByRole('button', { name: /войти/i }));

    expect(isUserLoggedIn()).toBe(true);
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  test('shows error popup for invalid credentials', async () => {
    const user = userEvent.setup();

    renderWithProviders(<Login />);

    await user.type(screen.getByLabelText('Логин'), 'admin');
    await user.type(screen.getByLabelText('Пароль'), 'wrong');
    await user.click(screen.getByRole('button', { name: /войти/i }));

    expect(
      screen.getByText('Что-то пошло не так! Попробуйте ещё раз.')
    ).toBeInTheDocument();
    expect(isUserLoggedIn()).toBe(false);
  });

  test('toggles password visibility', async () => {
    const user = userEvent.setup();

    renderWithProviders(<Login />);

    const passwordInput = screen.getByLabelText('Пароль');
    expect(passwordInput).toHaveAttribute('type', 'password');

    await user.click(screen.getByRole('button', { name: /показать пароль/i }));
    expect(passwordInput).toHaveAttribute('type', 'text');
  });
});
