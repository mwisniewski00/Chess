import express from "express";
import createGameController from "../controllers/game/createGameController";
import gamesController from "../controllers/game/gamesController";
import joinGameController from "../controllers/game/joinGameController";
import verifyJWT from "../middleware/verifyJWT";

const router = express.Router();

router.get("/", verifyJWT, gamesController.handleGetGames);

router.get("/:id", verifyJWT, gamesController.handleGetGameById);

router.post("/", verifyJWT, createGameController.handleCreateGame);

router.put("/join/:id", verifyJWT, joinGameController.handleJoinGame);

export default router;
