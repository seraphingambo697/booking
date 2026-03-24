/**
 * src/api/apiClient.ts
 * Instance Axios configurée pour le backend Django.
 *
 * Le backend retourne toutes ses réponses dans une enveloppe :
 *   { "success": true, "data": { ... } }   → succès
 *   { "success": false, "error": { "code": "...", "message": "..." } }  → erreur
 *
 * L'intercepteur de réponse dépaquète automatiquement le champ "data"
 * pour que les repositories reçoivent directement l'objet métier.
 */
import axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";

/** Format de toutes les réponses success du backend */
interface ApiEnvelope<T = unknown> {
  success: boolean;
  data?: T;
  count?: number;
  error?: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
}

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000/api/v1",
  timeout: 15_000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// ── Intercepteur REQUÊTE — injection du token JWT 
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem("auth_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ── Intercepteur RÉPONSE — dépaquetage de l'enveloppe + gestion des erreurs ───
apiClient.interceptors.response.use(
  (response: AxiosResponse<ApiEnvelope>) => {
    // Le backend renvoie { success: true, data: ... }
    // On remplace response.data par response.data.data pour simplifier
    // l'usage dans les repositories : const { data } = await apiClient.get(...)
    if (response.data && typeof response.data === "object" && "success" in response.data) {
      if (response.data.success) {
        // Conserver count pour les listes paginées
        const unwrapped = response.data.data;
        (response as AxiosResponse).data = unwrapped;
      }
    }
    return response;
  },

  (error: AxiosError<ApiEnvelope>) => {
    const status = error.response?.status;
    const apiError = error.response?.data?.error;

    // 401 — token expiré ou invalide → logout automatique
    if (status === 401) {
      localStorage.removeItem("auth_token");
      localStorage.removeItem("auth_user");
      window.location.href = "/login";
      return Promise.reject(new Error("Session expirée, veuillez vous reconnecter."));
    }

    // 403 — accès refusé
    if (status === 403) {
      return Promise.reject(new Error(apiError?.message ?? "Accès refusé."));
    }

    // 404 — ressource introuvable
    if (status === 404) {
      return Promise.reject(new Error(apiError?.message ?? "Ressource introuvable."));
    }

    // 409 — conflit (dates déjà réservées, email déjà utilisé…)
    if (status === 409) {
      return Promise.reject(new Error(apiError?.message ?? "Conflit : la ressource existe déjà."));
    }

    // 422 — règle métier violée
    if (status === 422) {
      return Promise.reject(new Error(apiError?.message ?? "Données invalides."));
    }

    // 5xx — erreur serveur
    if (status && status >= 500) {
      return Promise.reject(new Error("Une erreur serveur est survenue. Veuillez réessayer."));
    }

    // Pas de réponse — problème réseau ou CORS
    if (!error.response) {
      return Promise.reject(
        new Error("Impossible de contacter le serveur. ")
      );
    }

    return Promise.reject(error);
  }
);

export default apiClient;
