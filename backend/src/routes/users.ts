import express from "express";
import verifyJWT from "../middleware/verifyJWT";
import loginController from "../controllers/loginController";
import logoutController from "../controllers/logoutController";
import refreshTokenController from "../controllers/refreshTokenController";
import registerController from "../controllers/registerController";
import usersController from "../controllers/usersController";
import validationController from "../controllers/validationController";

const router = express.Router();

router.get("/", verifyJWT, usersController.getUsers);

router.delete("/logout", logoutController.handleLogout);

router.get("/refresh-token", refreshTokenController.handleRefreshToken);

router.get("/username-taken", validationController.checkUsernameAvailability);

router.get("/email-taken", validationController.checkEmailAvailability);

router.post("/login", loginController.handleLogin);

router.post("/register", registerController.handleRegister);

export default router;
