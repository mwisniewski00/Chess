import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt, { Secret } from "jsonwebtoken";
import User from "../models/User";
import getErrorMessage from "../helpers/getErrorMessage";
require("dotenv").config();

const loginController = {
  handleLogin: async (req: Request, res: Response) => {
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
          { expiresIn: "1d" },
        );
        const refreshToken = jwt.sign(
          { username: user.username },
          process.env.REFRESH_TOKEN_SECRET as Secret,
          { expiresIn: "7d" },
        );

        user.refreshToken = refreshToken;
        await User.findOneAndUpdate({ email }, user);

        res.cookie("jwt", refreshToken, {
          httpOnly: true,
          sameSite: "none",
          secure: true,
          maxAge: 24 * 60 * 60 * 1000 * 7,
        });

        return res.json({
          status: "success",
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
  },
};

export default loginController;
