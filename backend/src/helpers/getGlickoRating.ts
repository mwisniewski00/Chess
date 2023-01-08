import glicko2 from "glicko2";

export type Score = 0.5 | 1;

interface IGlickoPlayer {
  rating: number;
  rd: number;
  vol: number;
}

interface ISettings {
  tau: number;
  rating: number;
  rd: number;
  vol: number;
}

const settings: ISettings = {
  tau: 0.5, // "Reasonable choices are between 0.3 and 1.2, though the system should be tested to decide which value results in greatest predictive accuracy."
  rating: 1500, // "The system's default rating for a new player. Reasonable choices are between 1000 and 2000."
  rd: 200, // "The system's default RD (volatility) for a new player. Reasonable choices are between 30 and 350."
  vol: 0.06, // "The system's default volatility for a new player. Reasonable choices are between 0.03 and 0.5."
};

const glicko = new glicko2.Glicko2(settings);

const getGlickoRating = (
  player: IGlickoPlayer,
  opponent: IGlickoPlayer,
  score: Score,
) => {
  const player1 = glicko.makePlayer(player.rating, player.rd, player.vol);
  const player2 = glicko.makePlayer(opponent.rating, opponent.rd, opponent.vol);

  glicko.updateRatings([[player1, player2, score]]);

  return {
    player1Rating: Math.floor(player1.getRating()),
    player2Rating: Math.floor(player2.getRating()),
  };
};

export default getGlickoRating;
