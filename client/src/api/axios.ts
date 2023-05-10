import axios from "axios";
const BASE_URL: string =
  (process.env.REACT_APP_API_URL as string) || "http://localhost:5000/";

export default axios.create({
  baseURL: BASE_URL,
});

export const axiosPrivate = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});
