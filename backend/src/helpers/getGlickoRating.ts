import { Glicko2 } from "glicko2.ts";

export type Score = 0.5 | 1;

interface IGlickoPlayer {
  rating: number;
  rd: number;
  vol: number;
}

const glicko = new Glicko2();

const getGlickoRating = (
  player: IGlickoPlayer,
  opponent: IGlickoPlayer,
  score: Score,
) => {
  const player1 = glicko.makePlayer(player.rating, player.rd, player.vol);
  const player2 = glicko.makePlayer(opponent.rating, opponent.rd, opponent.vol);

  glicko.updateRatings([[player1, player2, score]]);

  return {
    player1Rating: player1,
    player2Rating: player2,
  };
};

export default getGlickoRating;
