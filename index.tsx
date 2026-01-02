import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

function ensureRoot(): HTMLElement {
  let el = document.getElementById("root");
  if (!el) {
    el = document.createElement("div");
    el.id = "root";
    document.body.appendChild(el);
    console.log("Created #root at runtime");
  }
  return el;
}

try {
  const root = ReactDOM.createRoot(ensureRoot());
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
  console.log("React mounted App");
} catch (err) {
  console.error("Mount failed:", err);
}
