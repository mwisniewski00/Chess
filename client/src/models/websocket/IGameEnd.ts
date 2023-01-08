interface IGameEnd {
  player1: {
    username: string;
    ratingDiff: number;
    status: "win" | "loss" | "draw";
  };
  player2: {
    username: string;
    ratingDiff: number;
    status: "win" | "loss" | "draw";
  };
}

export default IGameEnd;
