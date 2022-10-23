import { Routes, Route, Navigate } from "react-router-dom";
import App from "./App";
import { GameView } from "./components/Game/GameView";

export const Routing: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/lobby" element={<GameView />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
