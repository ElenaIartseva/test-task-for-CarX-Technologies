import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode
} from 'react';
import { STORAGE_KEYS } from '../utils/constants';
import { isUserLoggedIn, loginUser, logoutUser } from '../utils/storage';

interface AuthContextValue {
  isLoggedIn: boolean;
  userLogin: string;
  login: (loginName: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(isUserLoggedIn);
  const [userLogin, setUserLogin] = useState(
    () => localStorage.getItem(STORAGE_KEYS.userLogin) || ''
  );

  const login = useCallback((loginName: string) => {
    loginUser(loginName);
    setIsLoggedIn(true);
    setUserLogin(loginName);
  }, []);

  const logout = useCallback(() => {
    logoutUser();
    setIsLoggedIn(false);
    setUserLogin('');
  }, []);

  const value = useMemo(
    () => ({
      isLoggedIn,
      userLogin,
      login,
      logout
    }),
    [isLoggedIn, userLogin, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return context;
};
