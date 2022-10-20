import axios from "api/axios";
import useAuth from "./useAuth";

const useRefreshToken = () => {
  const { auth, setAuth } = useAuth();

  const refresh = async () => {
    try {
      const response = await axios.get("/users/refresh-token", {
        withCredentials: true, //sends http only cookies
      });

      console.log("Refreshed token, response: ", response);

      setAuth({ ...auth, token: response.data.token });

      return response.data.token;
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  return refresh;
};

export default useRefreshToken;
