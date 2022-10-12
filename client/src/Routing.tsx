import { Routes, Route, Navigate } from "react-router-dom";
import { HeroPage } from "./components/hero-page/HeroPage";
import { Lobby } from "./components/lobby/Lobby";

export const Routing: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<HeroPage />} />
      <Route path="/lobby" element={<Lobby />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
