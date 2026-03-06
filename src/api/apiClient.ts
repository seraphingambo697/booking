/**
 * src/api/apiClient.ts
 *
 * Client HTTP centralisé (instance Axios configurée).
 *
 * Centraliser ici permet de :
 * - Configurer l'URL de base une seule fois (depuis .env)
 * - Ajouter le token d'auth automatiquement sur toutes les requêtes
 * - Intercepter et normaliser les erreurs API
 * - Gérer le refresh token si nécessaire
 *
 * Tous les modules API (hotelApi, bookingApi...) utilisent
 * cette instance plutôt qu'axios directement.
 */

import axios, { AxiosInstance, AxiosError } from "axios";

/**
 * Instance Axios pré-configurée.
 * Utilise VITE_API_URL depuis les variables d'environnement.
 */
const apiClient: AxiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:3000/api",
    timeout: 10000,                          // 10 secondes max
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
            // Ajoute l'header Authorization : "Bearer <token>"
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

/**
 * Intercepteur de réponse — normalise les erreurs API.
 * Exécuté après chaque réponse (succès ou erreur).
 */
apiClient.interceptors.response.use(
    // Réponse succès : retour direct
    (response) => response,

    // Réponse erreur : normalisation
    (error: AxiosError) => {
        if (error.response?.status === 401) {
            // Token expiré → déconnexion automatique
            localStorage.removeItem("auth_token");
            localStorage.removeItem("auth_user");
            window.location.href = "/login";
        }
        return Promise.reject(error);
    }
);

export default apiClient;