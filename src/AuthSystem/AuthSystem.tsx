import React from 'react';
import { Navigate, useLocation } from 'react-router';

const authValidation = (user: string, password: string): boolean => {
  const userAllowed = ['Clara', 'Gerard', 'Gloria', 'Ignasi'];
  const passwordRegEx =/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/g;
  
  return userAllowed.indexOf(user) >= 0 && passwordRegEx.test(password);
}

interface AuthContextType {
  isLogged: boolean;
  signin: (callback: VoidFunction) => void;
  signout: (callback: VoidFunction) => void;
}

// eslint-disable-next-line @typescript-eslint/no-empty-function
const AuthContext = React.createContext<AuthContextType>({ isLogged: false, signin: () => {}, signout: () => {} });

function AuthProvider({ children }: { children: JSX.Element }):JSX.Element {
  
  const [isLogged, setIsLogged] = React.useState<boolean>(localStorage.getItem('user') ==='authenticated');

  const signin = (callback: VoidFunction) => {
    localStorage.setItem('user', 'authenticated');
    setIsLogged(true);
    callback();
  };
  
  const signout = (callback: VoidFunction) => {
    localStorage.removeItem('user');
    setIsLogged(false);
    callback();
  };

  const value = { isLogged, signin, signout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

function useAuth():AuthContextType {
  return React.useContext(AuthContext);
}

function RequireAuth({ children }: { children: JSX.Element }): JSX.Element {
  const auth = useAuth();
  const location = useLocation();

  if (!auth.isLogged) {
    return <Navigate to="/login" state={{ from: location }} />;
  }

  return children;
}
  
export {AuthProvider, RequireAuth, useAuth, authValidation}
