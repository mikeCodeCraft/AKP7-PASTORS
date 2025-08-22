import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
// Register global axios interceptors and auth auto-logout behavior
import "./api/http";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
