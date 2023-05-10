import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt, { Secret } from "jsonwebtoken";
import { User } from "../../models/User";
import getErrorMessage from "../../helpers/getErrorMessage";
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
        const tokenData = { username: user.username, _id: user._id };
        const accessToken = jwt.sign(
          tokenData,
          process.env.ACCESS_TOKEN_SECRET as Secret,
          { expiresIn: 60 },
        );
        const refreshToken = jwt.sign(
          tokenData,
          process.env.REFRESH_TOKEN_SECRET as Secret,
          { expiresIn: "7d" },
        );
        const lastLoginDate = new Date();

        user.refreshToken = refreshToken;
        user.lastLoginDate = lastLoginDate;
        await User.findOneAndUpdate({ email }, user);

        res.cookie("jwt", refreshToken, {
          httpOnly: true,
          sameSite: "none",
          // Uncomment when ssl is done
          // secure: true,
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

      return res.status(401).json({ error: { userFound: false } });
    } catch (error) {
      console.log(getErrorMessage(error));
      res.status(500).json({ error: getErrorMessage(error) });
    }
  },
};

export default loginController;
