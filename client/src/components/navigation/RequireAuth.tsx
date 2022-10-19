import useAuth from "hooks/useAuth";
import { Navigate, Outlet, useLocation } from "react-router-dom";

const RequireAuth: React.FC = () => {
  const { auth } = useAuth();
  const location = useLocation();

  return auth?.username ? (
    <Outlet />
  ) : (
    <Navigate to="/" state={{ from: location }} replace />
  );
};

export default RequireAuth;

