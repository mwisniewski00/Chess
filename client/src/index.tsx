import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import { Routing } from "./Routing";
import "./index.scss";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement,
);

root.render(
  <React.StrictMode>
    <Router>
      <Routing />
    </Router>
  </React.StrictMode>,
);
