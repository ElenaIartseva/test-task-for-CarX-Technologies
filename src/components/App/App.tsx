import { Routes, Route, Navigate } from 'react-router-dom';
import Main from '../Main/Main';
import Tickets from '../Tickets/Tickets';
import Login from '../Login/Login';
import NotFound from '../NotFound/NotFound';
import ProtectedRoute from '../ProtectedRoute/ProtectedRoute';
import AppLayout from '../AppLayout/AppLayout';
import { TicketsProvider } from '../../contexts/TicketsContext';
import { useAuth } from '../../contexts/AuthContext';
import styles from './App.module.scss';

const LoginRoute = () => {
  const { isLoggedIn } = useAuth();

  if (isLoggedIn) {
    return <Navigate to='/' replace />;
  }

  return <Login />;
};

const App = () => {
  return (
    <div className={styles.app}>
      <Routes>
        <Route path='/login' element={<LoginRoute />} />
        <Route element={<ProtectedRoute />}>
          <Route
            element={
              <TicketsProvider>
                <AppLayout />
              </TicketsProvider>
            }
          >
            <Route path='/' element={<Main />} />
            <Route path='/tickets/:id' element={<Tickets />} />
          </Route>
        </Route>
        <Route path='/404' element={<NotFound />} />
        <Route path='*' element={<NotFound />} />
      </Routes>
    </div>
  );
};

export default App;
