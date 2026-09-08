import { Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTickets } from '../../contexts/TicketsContext';
import TicketsList from '../TicketsList/TicketsList';
import styles from './AppLayout.module.scss';

const AppLayout = () => {
  const { userLogin, logout } = useAuth();
  const { tickets } = useTickets();

  return (
    <div className={styles.layout}>
      <header className={styles.header}>
        {userLogin ? (
          <p className={styles.userInfo}>Вы вошли как {userLogin}</p>
        ) : null}
        <button type='button' className={styles.logoutBtn} onClick={logout}>
          Выйти
        </button>
      </header>

      <Outlet />

      <section className={styles.container}>
        <h3 className={styles.title}>Список обращений</h3>
        <TicketsList tickets={tickets} />
      </section>
    </div>
  );
};

export default AppLayout;
