import { axiosPrivate } from "api/axios";
import { useEffect } from "react";
import useAuth from "./useAuth";
import useRefreshToken from "./useRefreshToken";

const useAxiosPrivate = () => {
  const refresh = useRefreshToken();
  const { auth } = useAuth();

  useEffect(() => {
    const reqInterception = axiosPrivate.interceptors.request.use(
      config => {
        if (config.headers && !config.headers["Authorization"]) {
          config.headers["Authorization"] = `Bearer ${auth?.token}`;
        }
        return config;
      },
      error => Promise.reject(error),
    );

    const resInterception = axiosPrivate.interceptors.response.use(
      response => response,
      async error => {
        const interceptedRequest = error?.config;
        if (error?.response?.status === 403 && !interceptedRequest?.sent) {
          interceptedRequest.sent = true;
          const newAccessToken = await refresh();
          interceptedRequest.headers[
            "Authorization"
          ] = `Bearer ${newAccessToken}`;
          return axiosPrivate(interceptedRequest);
        }
        return Promise.reject(error);
      },
    );

    return () => {
      axiosPrivate.interceptors.request.eject(reqInterception);
      axiosPrivate.interceptors.response.eject(resInterception);
    };
  }, [auth, refresh]);

  return axiosPrivate;
};

export default useAxiosPrivate;
