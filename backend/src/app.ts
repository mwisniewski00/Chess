import express, { Application, NextFunction, Request, Response } from "express";
import mongoose, { ConnectOptions } from "mongoose";
import cors from "cors";
import dbConfig from "./config/dbConn";
import users from "./routes/users";
import games from "./routes/games";
import credentials from "./middleware/credentials";
import corsOptions from "./config/corsOptions";
import cookieParser from "cookie-parser";
import http from "http";
import { initSocket } from "./socket";
import ExpressError from "./helpers/ExpressError";
import getErrorMessage from "./helpers/getErrorMessage";

mongoose.set("strictQuery", false);

const app: Application = express();

app.use(cookieParser());
app.use(credentials);
app.use(cors(corsOptions));
app.use(express.json());

app.use("/users", users);
app.use("/games", games);

app.all("*", (_req: Request, res: Response) =>
  res.status(404).send({ error: "Route not found" }),
);

app.use(
  (error: ExpressError, _req: Request, res: Response, next: NextFunction) => {
    const { statusCode = 500, message } = error;
    console.error(getErrorMessage(error));
    res
      .status(statusCode)
      .send({ error: message || "Oh no, something went wrong!" });
  },
);

const server = http.createServer(app);

initSocket(server, app);

const mongoConnectionString =
  process.env.NODE_ENV === "production"
    ? `mongodb+srv://${dbConfig.user}:${dbConfig.password}@chess.opemt6o.mongodb.net/?retryWrites=true&w=majority`
    : `mongodb://${dbConfig.host}:${dbConfig.port}/${dbConfig.database}`;

mongoose
  .connect(mongoConnectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  } as ConnectOptions)
  .then(response => {
    console.log(
      `Connected to MongoDB. Database name: "${response.connections[0].name}"`,
    );
    const port = process.env.PORT || 5000;
    server.listen(port, () => {
      console.log(`API server listening at http://localhost:${port}`);
    });
  })
  .catch(error => console.error("Error connecting to MongoDB", error));
