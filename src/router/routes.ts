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

  MY_BOOKINGS: "/my-bookings",

  LOGIN: "/login",

  REGISTER: "/register",
} as const;
