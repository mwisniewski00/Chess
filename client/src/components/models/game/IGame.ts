import IMessage from "../websocket/IChatMessage";
import IPlayer from "./IPlayer";

interface IGame {
  id: string;
  playerWhite: IPlayer | null;
  playerBlack: IPlayer | null;
  chat: IMessage[];
}

export default IGame;
