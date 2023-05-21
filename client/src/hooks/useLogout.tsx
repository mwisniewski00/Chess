import useAuth from "./useAuth";
import useAxiosPrivate from "./useAxiosPrivate";

const useLogout = () => {
  const { setAuth } = useAuth();
  const axiosPrivate = useAxiosPrivate();

  const logout = async () => {
    setAuth({});
    await axiosPrivate.delete("/users/logout", {
      withCredentials: true,
    });
  };

  return logout;
};

export default useLogout;
