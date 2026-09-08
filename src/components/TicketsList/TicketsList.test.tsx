import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import TicketsList from './TicketsList';
import type { Ticket } from '../../types';

describe('TicketsList', () => {
  test('shows empty message when there are no tickets', () => {
    render(
      <MemoryRouter>
        <TicketsList tickets={[]} />
      </MemoryRouter>
    );

    expect(screen.getByText(/обращений пока нет/i)).toBeInTheDocument();
  });

  test('renders ticket links', () => {
    const tickets: Ticket[] = [
      {
        id: 42,
        category: 'Категория 2',
        text: 'Описание проблемы',
        files: [],
        createdAt: '08.09.2026, 11:00:00',
        status: 'open'
      }
    ];

    render(
      <MemoryRouter>
        <TicketsList tickets={tickets} />
      </MemoryRouter>
    );

    expect(screen.getByRole('link')).toHaveAttribute('href', '/tickets/42');
    expect(screen.getByText(/тема: категория 2/i)).toBeInTheDocument();
    expect(screen.getByText(/статус: открыт/i)).toBeInTheDocument();
  });
});
