import RequireAuth from "components/navigation/RequireAuth";
import PersistLogin from "components/user/PersistLogin";
import Profile from "components/user/profile/Profile";
import { Routes, Route, Navigate } from "react-router-dom";
import { HeroPage } from "./components/hero-page/HeroPage";
import { Lobby } from "./components/lobby/Lobby";

export const Routing: React.FC = () => {
  return (
    <Routes>
      <Route element={<PersistLogin />}>
        <Route path="/home" element={<HeroPage />} />

        {/* protected routes */}
        <Route element={<RequireAuth />}>
          <Route path="/lobby" element={<Lobby />} />
          <Route path="/profile" element={<Profile />} />
        </Route>

        <Route path="*" element={<Navigate to="/home" replace />} />
      </Route>
    </Routes>
  );
};
