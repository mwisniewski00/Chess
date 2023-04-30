import { Glicko2, Player } from "chessrating";
import { IUser } from "../models/User";

export type Score = 0.5 | 1;

const getGlickoRating = (player: IUser, opponent: IUser, score: Score) => {
  const player1 = new Player(
    player.rating,
    player.ratingDeviation,
    player.volatility,
  );
  const player2 = new Player(
    opponent.rating,
    opponent.ratingDeviation,
    opponent.volatility,
  );

  Glicko2.executeMatch(player1, player2, score);

  return {
    player1Rating: player1,
    player2Rating: player2,
  };
};

export default getGlickoRating;
