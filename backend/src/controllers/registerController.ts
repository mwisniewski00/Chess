import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt, { Secret } from "jsonwebtoken";
import User from "../models/User";
import getErrorMessage from "../helpers/getErrorMessage";
require("dotenv").config();

const registerController = {
    handleRegister: async (req: Request, res: Response) => {
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
      },
}

export default registerController;