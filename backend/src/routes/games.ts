import express from "express";
import chatController from "../controllers/game/chatController";
import createGameController from "../controllers/game/createGameController";
import gamesController from "../controllers/game/gamesController";
import joinGameController from "../controllers/game/joinGameController";
import verifyJWT from "../middleware/verifyJWT";
import catchAsync from "../helpers/catchAsync";

const router = express.Router();

router.get("/", verifyJWT, catchAsync(gamesController.handleGetGames));

router.get("/:id", verifyJWT, catchAsync(gamesController.handleGetGameById));

router.post("/", verifyJWT, catchAsync(createGameController.handleCreateGame));

router.put(
  "/join/:id",
  verifyJWT,
  catchAsync(joinGameController.handleJoinGame),
);

router.post(
  "/:id/message",
  verifyJWT,
  catchAsync(chatController.handleNewMessage),
);

export default router;
