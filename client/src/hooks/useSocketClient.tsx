import { useContext } from "react";
import { SocketContext } from "context/SocketProvider";

const useSocketClient = () => useContext(SocketContext);

export default useSocketClient;
