import React from "react";
import { szach } from "@chessgame/test/test";
import { HeroPage } from "./components/hero-page/HeroPage";
import { Navbar } from "./components/navbar/Navbar";



function App() {
  return <div className="app">
    <Navbar />
    <HeroPage />
  </div>;
}

export default App;
