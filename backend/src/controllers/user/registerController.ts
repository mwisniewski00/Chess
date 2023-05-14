import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt, { Secret } from "jsonwebtoken";
import { User } from "../../models/User";
import getErrorMessage from "../../helpers/getErrorMessage";
require("dotenv").config();

const registerController = {
  handleRegister: async (req: Request, res: Response) => {
    const { username, email, password } = req.body;

    try {
      const hashedPassword = await bcrypt.hash(password, 15);

      const registrationDate = new Date();
      const lastLoginDate = registrationDate;

      const user = await User.create({
        username,
        email,
        password: hashedPassword,
        registrationDate,
        lastLoginDate,
      });

      const accessToken = jwt.sign(
        { username: username, _id: user._id },
        process.env.ACCESS_TOKEN_SECRET as Secret,
        { expiresIn: "15m" },
      );
      const refreshToken = jwt.sign(
        { username: username, _id: user._id },
        process.env.REFRESH_TOKEN_SECRET as Secret,
        { expiresIn: "7d" },
      );

      user.refreshToken = refreshToken;
      await user.save();

      res.cookie("jwt", refreshToken, {
        httpOnly: true,
        sameSite: "none",
        secure: true,
        maxAge: 24 * 60 * 60 * 1000 * 7,
      });

      return res.json({
        token: accessToken,
        userInfo: {
          id: user._id,
          username: user.username,
          email: user.email,
        },
      });
    } catch (error: any) {
      if (error.code === 11000) {
        return res.status(402).json({ error: "Username or email taken" });
      }
      console.error(getErrorMessage(error));
      res.status(500).json({ error: getErrorMessage(error) });
    }
  },
};

export default registerController;
