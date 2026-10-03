import axios from "axios";
import { clearAuthStorage } from "../utils/auth";

const axiosInstance = axios.create({
    baseURL:
        import.meta.env.VITE_API_BASE_URL ||
        "http://localhost:8081/api",
    timeout: 15000,
});

axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");

        if (
            token &&
            token !== "null" &&
            token !== "undefined" &&
            token.length > 10
        ) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
    (response) => response,

    (error) => {

        if (
            error.response?.status === 401 &&
            !error.config?.url?.includes("/auth/login")
        ) {
            clearAuthStorage();
            window.location.assign("/login");
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;