import { createContext, useState, ReactNode } from "react";

interface IUserModalContext {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const UserModalContext = createContext<IUserModalContext>({
  isOpen: false,
  setIsOpen: () => {},
});

interface AuthProviderProps {
  children: ReactNode;
}

export const UserModalProvider: React.FC<AuthProviderProps> = ({
  children,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <UserModalContext.Provider value={{ isOpen, setIsOpen }}>
      {children}
    </UserModalContext.Provider>
  );
};

export default UserModalContext;
