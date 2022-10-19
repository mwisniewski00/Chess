import express, { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../mongo/models/User";

const JWT_SECRET =
  "dsa!78979dh0(#$dsa9q2dhn9qchd90qh@#dhaspashdlaksd-3294c23u4209ncdna092";

const getErrorMessage = (error: unknown) => {
  if (error instanceof Error) return error.message;
  return String(error);
};

const router = express.Router();
//Only in development
router.get("/", async (req: Request, res: Response) => {
  try {
    const users = await User.find();
    res.json(users);
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
      const token = jwt.sign(
        { id: user._id, username: user.username },
        JWT_SECRET,
      );

      return res.json({
        status: "success",
        token: token,
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

    const token = jwt.sign(
      { id: user._id, username: user.username },
      JWT_SECRET,
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
      return res.json({ error: { usernameTaken: true } });
    }
    console.log(getErrorMessage(error));
    res.status(500).json({ error: getErrorMessage(error) });
  }
});

export default router;
