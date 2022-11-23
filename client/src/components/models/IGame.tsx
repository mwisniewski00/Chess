import IPlayer from "./IPlayer";

interface IGame {
  id: string;
  playerWhite: IPlayer | null;
  playerBlack: IPlayer | null;
}

export default IGame;
