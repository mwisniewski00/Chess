import { Response, Request } from "express";
import getErrorMessage from "../../helpers/getErrorMessage";
import Game from "../../models/Game";

const joinGameController = {
  handleJoinGame: async (req: Request, res: Response) => {
    const gameId = req.params.id;
    const player = req.body;

    try {
      const game = await Game.findById(gameId).lean();
      console.log("Found GAME: ", game);

      if (!game) {
        return res.status(404).json({ error: "Game not found" });
      }

      if (game.playerWhite && game.playerBlack) {
        return res.status(400).json({ error: "Game is full" });
      }

      if (game.playerWhite && !game.playerBlack) {
        game.playerBlack = player;
      }

      if (!game.playerWhite) {
        game.playerWhite = player;
      }

      const updatedGame = await Game.findByIdAndUpdate(gameId, game);

      const returnColor =
        player.username === updatedGame?.playerWhite ? "white" : "black";
      console.log("returnColor: ", returnColor);

      res.status(200).json({ color: returnColor });
    } catch (error) {
      console.log(getErrorMessage(error));
      res.status(500).json({ error: getErrorMessage(error) });
    }
  },
};

export default joinGameController;
