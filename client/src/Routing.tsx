import { Routes, Route, Navigate } from "react-router-dom";
import { HeroPage } from "./components/hero-page/HeroPage";
import "./Routing.scss";

export const Routing: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<HeroPage />} />
      <Route path="/lobby" element={<HeroPage />} />
      <Route
        path="*"
        element={<Navigate to="/" replace />}
    />
    </Routes>
  );
};
