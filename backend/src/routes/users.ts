import express from "express";
import verifyJWT from "../middleware/verifyJWT";
import loginController from "../controllers/user/loginController";
import logoutController from "../controllers/user/logoutController";
import refreshTokenController from "../controllers/user/refreshTokenController";
import registerController from "../controllers/user/registerController";
import usersController from "../controllers/user/usersController";
import validationController from "../controllers/user/validationController";

const router = express.Router();

router.get("/", verifyJWT, usersController.getUsers);

router.delete("/logout", verifyJWT, logoutController.handleLogout);

router.get("/refresh-token", refreshTokenController.handleRefreshToken);

router.get("/username-taken", validationController.checkUsernameAvailability);

router.get("/email-taken", validationController.checkEmailAvailability);

router.post("/login", loginController.handleLogin);

router.post("/register", registerController.handleRegister);

export default router;
