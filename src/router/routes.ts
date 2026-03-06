/**
 * src/router/routes.ts
 *
 * Constantes de routes de l'application.
 *
 * Centraliser les routes évite les strings dupliquées et les typos.
 * Les routes avec paramètres sont des fonctions :
 *   ROUTES.HOTEL_DETAIL("h1") → "/hotel/h1"
 *   ROUTES.HOTEL_DETAIL()    → "/hotel/:id"  (pour AppRouter)
 *
 * Usage :
 *   navigate(ROUTES.HOME)
 *   navigate(ROUTES.HOTEL_DETAIL(hotel.id))
 *   <Route path={ROUTES.HOTEL_DETAIL()} element={...} />
 */

export const ROUTES = {
    /** Page d'accueil avec la barre de recherche */
    HOME: "/",

    /** Résultats de recherche */
    SEARCH: "/search",

    /**
     * Détail d'un hôtel.
     * @param id - ID de l'hôtel (":id" par défaut pour AppRouter)
     */
    HOTEL_DETAIL: (id: string = ":id") => `/hotel/${id}`,

    /** Tunnel de réservation (multi-étapes) */
    BOOKING: "/booking",

    /**
     * Page de confirmation d'une réservation.
     * @param id - ID de la réservation
     */
    BOOKING_CONFIRMATION: (id: string = ":id") => `/booking/confirmation/${id}`,

    /** Liste des réservations de l'utilisateur */
    MY_BOOKINGS: "/my-bookings",

    /** Page de connexion */
    LOGIN: "/login",

    /** Page d'inscription */
    REGISTER: "/register",
} as const;