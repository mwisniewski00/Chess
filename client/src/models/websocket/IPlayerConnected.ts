import IPlayer from "models/game/IPlayer";
import { ITimers } from "types";

interface IPlayerConnectedData {
  playerWhite?: IPlayer;
  playerBlack?: IPlayer;
  timers?: ITimers;
}

export default IPlayerConnectedData;
