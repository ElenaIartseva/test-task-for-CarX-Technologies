import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode
} from 'react';
import type { Comment, Ticket } from '../types';
import {
  getStoredComments,
  getStoredTickets,
  saveComments,
  saveTickets
} from '../utils/storage';

interface TicketsContextValue {
  tickets: Ticket[];
  comments: Comment[];
  addTicket: (ticket: Ticket) => void;
  updateTicket: (ticket: Ticket) => void;
  addComment: (comment: Comment) => void;
  getTicketById: (id: number) => Ticket | undefined;
  getCommentsByTicketId: (id: number) => Comment[];
}

const TicketsContext = createContext<TicketsContextValue | null>(null);

export const TicketsProvider = ({ children }: { children: ReactNode }) => {
  const [tickets, setTickets] = useState<Ticket[]>(() => getStoredTickets());
  const [comments, setComments] = useState<Comment[]>(() =>
    getStoredComments()
  );
  const ticketsRef = useRef(tickets);
  const commentsRef = useRef(comments);

  ticketsRef.current = tickets;
  commentsRef.current = comments;

  const addTicket = useCallback((ticket: Ticket) => {
    const updated = [ticket, ...ticketsRef.current];
    saveTickets(updated);
    setTickets(updated);
  }, []);

  const updateTicket = useCallback((updatedTicket: Ticket) => {
    const updated = ticketsRef.current.map(ticket =>
      ticket.id === updatedTicket.id ? updatedTicket : ticket
    );
    saveTickets(updated);
    setTickets(updated);
  }, []);

  const addComment = useCallback((comment: Comment) => {
    const updated = [comment, ...commentsRef.current];
    saveComments(updated);
    setComments(updated);
  }, []);

  const getTicketById = useCallback(
    (id: number) => tickets.find(ticket => Number(ticket.id) === Number(id)),
    [tickets]
  );

  const getCommentsByTicketId = useCallback(
    (id: number) =>
      comments.filter(comment => Number(comment.ticketId) === Number(id)),
    [comments]
  );

  const value = useMemo(
    () => ({
      tickets,
      comments,
      addTicket,
      updateTicket,
      addComment,
      getTicketById,
      getCommentsByTicketId
    }),
    [
      tickets,
      comments,
      addTicket,
      updateTicket,
      addComment,
      getTicketById,
      getCommentsByTicketId
    ]
  );

  return (
    <TicketsContext.Provider value={value}>{children}</TicketsContext.Provider>
  );
};

export const useTickets = () => {
  const context = useContext(TicketsContext);

  if (!context) {
    throw new Error('useTickets must be used within TicketsProvider');
  }

  return context;
};
