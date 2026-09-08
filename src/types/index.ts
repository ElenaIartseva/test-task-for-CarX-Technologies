export interface TicketFile {
  name: string;
  data?: string;
}

export type TicketStatus = 'open' | 'closed';

export interface Ticket {
  id: number;
  category: string;
  text: string;
  files: TicketFile[];
  createdAt: string;
  status: TicketStatus;
}

export interface Comment {
  id?: number;
  text: string;
  date: string;
  ticketId: number;
}

export type InfoPopupVariant = 'alert' | 'confirm';

export interface LoginFormValues {
  login: string;
  password: string;
}

export type LoginFormErrors = Partial<Record<keyof LoginFormValues, string>>;
