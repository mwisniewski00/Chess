import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import "./index.scss";
import { AuthProvider } from "context/AuthProvider";
import { UserModalProvider } from "context/UserModalProvider";
import App from "App";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement,
);

root.render(
  <React.StrictMode>
    <AuthProvider>
      <Router>
        <UserModalProvider>
          <App />
        </UserModalProvider>
      </Router>
    </AuthProvider>
  </React.StrictMode>,
);
