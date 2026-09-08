import { render, type RenderResult } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import type { ReactElement } from 'react';
import { AuthProvider } from '../contexts/AuthContext';
import { NotificationProvider } from '../contexts/NotificationContext';
import { TicketsProvider } from '../contexts/TicketsContext';

interface RenderOptions {
  route?: string;
  withTickets?: boolean;
}

export const renderWithProviders = (
  ui: ReactElement,
  { route = '/', withTickets = true }: RenderOptions = {}
): RenderResult => {
  let content = ui;

  if (withTickets) {
    content = <TicketsProvider>{content}</TicketsProvider>;
  }

  return render(
    <MemoryRouter initialEntries={[route]}>
      <AuthProvider>
        <NotificationProvider>{content}</NotificationProvider>
      </AuthProvider>
    </MemoryRouter>
  );
};
