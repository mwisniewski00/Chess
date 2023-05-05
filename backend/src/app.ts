import express, { Application } from "express";
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

mongoose.set("strictQuery", false);

const app: Application = express();

app.use(cookieParser());
app.use(credentials);
app.use(cors(corsOptions));
app.use(express.json());

app.use("/users", users);
app.use("/games", games);

const server = http.createServer(app);

initSocket(server, app);

mongoose
  .connect(process.env.MONGO_URL || `mongodb://${dbConfig.host}:${dbConfig.port}/${dbConfig.database}`, {
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
