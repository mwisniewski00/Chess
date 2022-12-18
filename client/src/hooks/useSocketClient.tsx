import io from "socket.io-client";

const useSocketClient = () => {
  const socketClientUrl =
    process.env.SOCKET_CLIENT_URL || "http://localhost:5000";
  const socket = io(socketClientUrl);

  return socket;
};

export default useSocketClient;
