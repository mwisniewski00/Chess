import { createContext, useState, ReactNode } from "react";

interface Auth {
    token?: string;
    username?: string;
    email?: string;
};

interface IAuthContext {
    auth: Auth; 
    setAuth: (auth: Auth) => void;
}

const AuthContext = createContext<IAuthContext>({auth: {}, setAuth: () => {}});

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [auth, setAuth] = useState<Auth>({});

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
        {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
