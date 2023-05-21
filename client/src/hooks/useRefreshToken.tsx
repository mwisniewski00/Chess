import axios from "api/axios";
import { useNavigate } from "react-router-dom";
import useAuth from "./useAuth";

const useRefreshToken = () => {
  const navigate = useNavigate();

  const { auth, setAuth } = useAuth();

  const refresh = async () => {
    try {
      const response = await axios.get("/users/refresh-token", {
        withCredentials: true, //sends http only cookies
      });

      setAuth({
        ...auth,
        token: response.data.accessToken,
        ...response.data.userInfo,
      });

      return response.data.accessToken;
    } catch (error: any) {
      if (error.response.status === 403) {
        setAuth({});
        navigate("/home");
      }
      return null;
    }
  };

  return refresh;
};

export default useRefreshToken;
