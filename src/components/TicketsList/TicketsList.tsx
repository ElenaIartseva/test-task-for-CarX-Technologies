import { Link } from 'react-router-dom';
import type { Ticket } from '../../types';
import styles from './TicketsList.module.scss';

interface TicketsListProps {
  tickets: Ticket[];
  emptyMessage?: string;
}

const TicketsList = ({
  tickets,
  emptyMessage = 'Обращений пока нет.'
}: TicketsListProps) => {
  if (!tickets.length) {
    return <p className={styles.empty}>{emptyMessage}</p>;
  }

  return (
    <ul className={styles.ticketsList}>
      {tickets.map(ticket => (
        <li key={ticket.id}>
          <Link className={styles.ticketItem} to={`/tickets/${ticket.id}`}>
            <p>Обращение: {ticket.id}</p>
            <p>Тема: {ticket.category}</p>
            <p>Дата создания: {ticket.createdAt}</p>
            <p>Статус: {ticket.status === 'open' ? 'Открыт' : 'Закрыт'}</p>
            <p>Текст: {ticket.text}</p>
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default TicketsList;
