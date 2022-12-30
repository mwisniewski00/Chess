import express from "express";
import chatController from "../controllers/game/chatController";
import createGameController from "../controllers/game/createGameController";
import gamesController from "../controllers/game/gamesController";
import joinGameController from "../controllers/game/joinGameController";
import gameMovesController from "../controllers/game/gameMovesController";
import verifyJWT from "../middleware/verifyJWT";

const router = express.Router();

router.get("/", verifyJWT, gamesController.handleGetGames);

router.get("/:id", verifyJWT, gamesController.handleGetGameById);

router.post("/", verifyJWT, createGameController.handleCreateGame);

router.put("/join/:id", verifyJWT, joinGameController.handleJoinGame);

router.post("/:id/message", verifyJWT, chatController.handleNewMessage);

router.post("/:id/move", verifyJWT, gameMovesController.handleMove);

export default router;
