require("dotenv").config();

import fs from "fs";

const sslOptions = {
  cert: fs.readFileSync(process.env.PATH_TO_CERT || ""),
  key: fs.readFileSync(process.env.PATH_TO_KEY || "")
};

  export default sslOptions;