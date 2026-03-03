import axios from "axios";
const URL = `${import.meta.env.VITE_API_URL}/api`;

const axiosInstance = axios.create({
  baseURL: URL,
  withCredentials: true,
});

export default axiosInstance;
