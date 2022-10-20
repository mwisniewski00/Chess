import express, { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt, { Secret } from "jsonwebtoken";
import User from "../mongo/models/User";
import verifyJWT, { IGetUserAuthInfoRequest } from "../middleware/verifyJWT";
import cookieParser from "cookie-parser";
require("dotenv").config();

const getErrorMessage = (error: unknown) => {
  if (error instanceof Error) return error.message;
  return String(error);
};

const router = express.Router();
// Only in development
router.get(
  "/",
  verifyJWT,
  async (req: IGetUserAuthInfoRequest, res: Response) => {
    try {
      const users = await User.find();
      res.json(users);
    } catch (error) {
      console.log(getErrorMessage(error));
      res.status(500).json({ error: getErrorMessage(error) });
    }
  },
);

router.post("/logout", async (req: Request, res: Response) => {
  const cookies = req.cookies;

  if (!cookies.jwt) return res.sendStatus(204);
  const refreshToken = cookies.jwt;

  try {
    const user = await User.findOne({ refreshToken });
    if (!user) {
      res.clearCookie("jwt", { httpOnly: true });
      return res.sendStatus(204);
    }

    user.refreshToken = "";
    await user.save();

    res.clearCookie("jwt", { httpOnly: true });
    res.sendStatus(204);
  } catch (error) {
    console.log(getErrorMessage(error));
    res.status(500).json({ error: getErrorMessage(error) });
  }
});

router.get("/refresh-token", async (req: Request, res: Response) => {
  console.log(req.cookies);
  
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(401);
  console.log(cookies.jwt);
  const refreshToken = cookies.jwt;

  try {
    const user = await User.findOne({ refreshToken });
    if (!user) return res.sendStatus(403);
    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET as Secret,
      (err: any, decoded: any) => {
        if (err || user.username !== decoded.username) {
          return res.sendStatus(403);
        }
        const accessToken = jwt.sign(
          { username: decoded.username },
          process.env.ACCESS_TOKEN_SECRET as Secret,
          { expiresIn: "30s" },
        );
        console.log("Refreshed Token for:", decoded.username);
        res.json({ accessToken });
      },
    );
  } catch (error) {
    console.log(getErrorMessage(error));
    res.status(500).json({ error: getErrorMessage(error) });
  }
});

router.get("/username-taken", async (req: Request, res: Response) => {
  const { username } = req.query;

  try {
    const user = await User.findOne({ username: username });
    if (user) {
      res.json({ usernameTaken: true });
    } else {
      res.json({ usernameTaken: false });
    }
  } catch (error) {
    console.log(getErrorMessage(error));
    res.status(500).json({ message: getErrorMessage(error) });
  }
});

router.get("/email-taken", async (req: Request, res: Response) => {
  const { email } = req.query;

  try {
    const user = await User.findOne({ email: email });
    if (user) {
      res.json({ emailTaken: true });
    } else {
      res.json({ emailTaken: false });
    }
  } catch (error) {
    console.log(getErrorMessage(error));
    res.status(500).json({ message: getErrorMessage(error) });
  }
});

router.post("/login", async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email }).lean();

    if (!user) {
      return res.status(401).json({ error: { userFound: false } });
    }

    if (await bcrypt.compare(password, user.password)) {
      const accessToken = jwt.sign(
        { username: user.username },
        process.env.ACCESS_TOKEN_SECRET as Secret,
        { expiresIn: '30s' },
      );
      const refreshToken = jwt.sign(
        { username: user.username },
        process.env.REFRESH_TOKEN_SECRET as Secret,
        { expiresIn: '1d' },
      );

      user.refreshToken = refreshToken;
      console.log(refreshToken);
      await User.findOneAndUpdate({ email }, user);

      res.cookie('jwt', refreshToken, {
        httpOnly: true,
        sameSite: 'none',
        secure: true,
        maxAge: 24 * 60 * 60 * 1000,
        // secure: true,
      })
      
      return res.json({
        status: 'success',
        token: accessToken,
        userInfo: {
          id: user._id,
          username: user.username,
          email: user.email,
        },
      });
    }

    return res.json({ error: { userFound: false } });
  } catch (error) {
    console.log(getErrorMessage(error));
    res.status(500).json({ error: getErrorMessage(error) });
  }
});

router.post("/register", async (req: Request, res: Response) => {
  const { username, email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 15);

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    console.log(process.env.ACCESS_TOKEN_SECRET as string);

    const token = jwt.sign(
      { username: user.username },
      process.env.ACCESS_TOKEN_SECRET as Secret,
    );

    return res.json({
      token: token,
      userInfo: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error: any) {
    if (error.code === 11000) {
      return res.status(402).json({ error: { usernameTaken: true } });
    }
    console.log(getErrorMessage(error));
    res.status(500).json({ error: getErrorMessage(error) });
  }
});

export default router;
