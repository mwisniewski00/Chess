import express, { Application } from "express";
import mongoose, { ConnectOptions } from "mongoose";
import cors from "cors";
import dbConfig from "./config/dbConn";
import users from "./routes/users";
import games from "./routes/games";
import credentials from "./middleware/credentials";
import corsOptions from "./config/corsOptions";
import cookieParser from "cookie-parser";
import https from "https";
import { initSocket } from "./socket";
import sslOptions from "./config/sslOptions";

mongoose.set("strictQuery", false);

const app: Application = express();

app.use(cookieParser());
app.use(credentials);
app.use(cors(corsOptions));
app.use(express.json());

app.use("/users", users);
app.use("/games", games);

const server = https.createServer(sslOptions, app);

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
      process.env.NODE_ENV === "production"
        ? console.log("Connected to MongoDB Atlas")
        : console.log("Connected to local instance of MongoDB")
    );
    const port = process.env.PORT || 5000;
    server.listen(port, () => {
      console.log(`API server listening at http://localhost:${port}`);
    });
  })
  .catch(error => console.error("Error connecting to MongoDB", error));
