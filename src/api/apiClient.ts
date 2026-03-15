/**
 * Tous les modules API (hotelApi, bookingApi...) utilisent
 * cette instance plutôt qu'axios directement.
 */

import axios, { AxiosInstance, AxiosError } from "axios";

const apiClient: AxiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000/api",
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    },
});

/**
 * Intercepteur de requête — ajoute le token JWT si présent.
 * Exécuté avant chaque requête sortante.
 */
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("auth_token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

/**
 * Intercepteur de réponse — normalise les erreurs API.
 */
apiClient.interceptors.response.use(
    (response) => response,

    (error: AxiosError) => {
        if (error.response?.status === 401) {
            localStorage.removeItem("auth_token");
            localStorage.removeItem("auth_user");
            window.location.href = "/login";
        }
        return Promise.reject(error);
    }
);

export default apiClient;