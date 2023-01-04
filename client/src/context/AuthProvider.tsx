import IAuth from "../models/IAuth";
import { createContext, useState, ReactNode } from "react";

interface IAuthContext {
  auth: IAuth;
  setAuth: (auth: IAuth) => void;
}

const AuthContext = createContext<IAuthContext>({
  auth: {},
  setAuth: () => {},
});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [auth, setAuth] = useState<IAuth>({});

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
