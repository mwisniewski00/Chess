import useAuth from "hooks/useAuth";
import React, { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

interface SocketContextType {
  socket: Socket | null;
}

export const SocketContext = createContext<SocketContextType>({
  socket: null,
});

interface SocketProviderProps {
  children: React.ReactNode;
  path: String;
  autoConnect?: boolean;
}

export const SocketProvider = ({
  children,
  path,
  autoConnect = true,
}: SocketProviderProps) => {
  const { auth } = useAuth();
  const socketClientUrl =
    (process.env.REACT_APP_SOCKET_URL || "http://localhost:5000") + path;
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const options = {
      extraHeaders: {
        Authorization: `Bearer ${auth?.token}`,
      },
      autoConnect,
    };
    const socketClient = io(socketClientUrl, options);
    setSocket(socketClient);

    return () => {
      socketClient.disconnect();
    };
  }, [socketClientUrl, auth?.token, autoConnect]);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
