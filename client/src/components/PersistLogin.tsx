import useAuth from "hooks/useAuth";
import useRefreshToken from "hooks/useRefreshToken";
import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";

const PersistLogin: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const refresh = useRefreshToken();
  const { auth } = useAuth();

  useEffect(() => {
    const verifyRefreshToken = async () => {
      try {
        console.log("Verifying refresh token");
        await refresh();
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };

    //only run when no user in state
    if (Object.keys(auth).length === 0) {
      verifyRefreshToken();
    } else {
      setIsLoading(false);
    }
  }, []);

  return <>{isLoading ? <div>Loading...</div> : <Outlet />}</>;
};

export default PersistLogin;
