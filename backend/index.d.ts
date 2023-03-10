import { Server } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";

declare module "glicko2";

declare global {
  namespace Express {
    interface Application {
      io: Server;
    }
  }
}
