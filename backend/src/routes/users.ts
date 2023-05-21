import express from "express";
import verifyJWT from "../middleware/verifyJWT";
import loginController from "../controllers/user/loginController";
import logoutController from "../controllers/user/logoutController";
import refreshTokenController from "../controllers/user/refreshTokenController";
import registerController from "../controllers/user/registerController";
import usersController from "../controllers/user/usersController";
import validationController from "../controllers/user/validationController";
import usersRankingController from "../controllers/user/usersRankingController";
import catchAsync from "../helpers/catchAsync";

const router = express.Router();

router.get("/", verifyJWT, catchAsync(usersController.getUsers));

router.delete("/logout", verifyJWT, catchAsync(logoutController.handleLogout));

router.get(
  "/refresh-token",
  catchAsync(refreshTokenController.handleRefreshToken),
);

router.get(
  "/username-taken",
  catchAsync(validationController.checkUsernameAvailability),
);

router.get(
  "/email-taken",
  catchAsync(validationController.checkEmailAvailability),
);

router.post("/login", catchAsync(loginController.handleLogin));

router.post("/register", catchAsync(registerController.handleRegister));

router.get("/profile/:username", catchAsync(usersController.getUser));

router.put("/profile", verifyJWT, catchAsync(usersController.editUser));

router.get(
  "/ranking",
  verifyJWT,
  catchAsync(usersRankingController.getRankingData),
);

export default router;
