import { Glicko2, Player } from "chessrating";

export type Score = 0.5 | 1;

interface IGlickoPlayer {
  rating: number;
  rd: number;
  vol: number;
}

const getGlickoRating = (
  player: IGlickoPlayer,
  opponent: IGlickoPlayer,
  score: Score,
) => {
  const player1 = new Player(player.rating, player.rd, player.vol);
  const player2 = new Player(opponent.rating, opponent.rd, opponent.vol);

  Glicko2.executeMatch(player1, player2, score);

  return {
    player1Rating: player1,
    player2Rating: player2,
  };
};

export default getGlickoRating;
