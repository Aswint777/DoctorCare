import axios from "axios";
import { API_URL } from "../config/apiConfig";

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
    withCredentials: true,
});

export default axiosInstance;