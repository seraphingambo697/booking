/**
 * Constantes de routes de l'application.
 */
export const ROUTES = {
  HOME: "/",

  SEARCH: "/search",
  PROFILE: "/profile",
  ADMIN: "/admin",
  HOTEL_DETAIL: (id: string = ":id") => `/hotel/${id}`,

  BOOKING: "/booking",

  BOOKING_CONFIRMATION: (id: string = ":id") => `/booking/confirmation/${id}`,

  /** Liste de toutes les réservations de l'utilisateur */
  MY_BOOKINGS: "/my-bookings",

  /** Formulaire de connexion */
  LOGIN: "/login",

  /** Formulaire d'inscription */
  REGISTER: "/register",
} as const;
