import React from "react";
import ReactDOM from "react-dom/client";
import {HeroUIProvider} from "@heroui/react";
import Home from "./app";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <HeroUIProvider>
      <main className="dark text-foreground bg-background">
        <Home />
      </main>
    </HeroUIProvider>
  </React.StrictMode>,
);