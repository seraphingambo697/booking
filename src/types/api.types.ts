
/**
 * Types TypeScript correspondant exactement aux réponses JSON du backend .
 *
 * Convention backend : snake_case dans le JSON.
 * Convention frontend : camelCase dans les entités (conversion dans les repositories).
 */

// ── Hôtel ─────────────────────────────────────────────────────────────────────

export interface ApiHotel {
    id: string;
    name: string;
    description: string;
    address: string;
    city: string;
    country: string;
    latitude: number;
    longitude: number;
    stars: number;
    status: string;
    amenities: string[];
    images: string[];
    phone?: string;
    email?: string;
    website?: string;
    owner_id: string;
    created_at: string;
    updated_at: string;
}

// ── Chambre ───────────────────────────────────────────────────────────────────

export interface ApiRoom {
    id: string;
    hotel_id: string;
    name: string;
    type: string;
    description: string;
    price_per_night: number;
    currency: string;
    capacity: number;
    size_sqm: number;
    bed_count: number;
    bed_type: string;
    floor: number;
    amenities: string[];
    images: string[];
    is_available: boolean;
}

/** Chambre enrichie retournée par POST /bookings/availability/ */
export interface ApiAvailableRoom {
    room: ApiRoom;
    nights: number;
    total_price: number;
    currency: string;
    is_free_cancel: boolean;
}

// ── Recherche ─────────────────────────────────────────────────────────────────

/** Résultat de POST /search/ */
export interface ApiSearchResult {
    hotel: ApiHotel;
    available_rooms: ApiRoom[];
    min_price: number;
    nights: number;
}

// ── Réservation ───────────────────────────────────────────────────────────────

export interface ApiBooking {
    id: string;
    user_id: string;
    hotel_id: string;
    room_id: string;
    // Dates (propriétés calculées depuis DateRange)
    check_in: string;             // "YYYY-MM-DD"
    check_out: string;
    nights: number;
    // Voyageurs (depuis GuestCount)
    guest_count: number;
    adults: number;
    children: number;
    // Prix (depuis Money)
    total_price: number;
    currency: string;
    // Statut
    status: string;               // "PENDING"|"CONFIRMED"|"CANCELLED"|"COMPLETED"
    status_label: string;         // "En attente"|"Confirmée"…
    is_cancellable: boolean;
    is_free_cancel: boolean;
    // Optionnels
    special_requests: string;
    cancelled_at: string | null;
    cancellation_reason: string;
    created_at: string;
    updated_at: string;
}

/** Résultat de DELETE /bookings/{id}/ */
export interface ApiCancelResult {
    booking: ApiBooking;
    is_free: boolean;
    refund_amount: number;
    refund_currency: string;
}

// ── Paiement ──────────────────────────────────────────────────────────────────

export interface ApiPayment {
    id: string;
    booking_id: string;
    user_id: string;
    amount: number;
    currency: string;
    status: string;               // "PENDING"|"SUCCEEDED"|"FAILED"|"REFUNDED"
    method: string;               // "CARD"|"PAYPAL"|"BANK_TRANSFER"
    gateway_ref: string;
    failure_reason: string;
    refunded_at: string | null;
    created_at: string;
}

// ── Utilisateur ───────────────────────────────────────────────────────────────

export interface ApiUser {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
    phone: string;
    pseudo: string;
    is_active: boolean;
    is_admin: boolean;
    created_at: string;
}

// ── Avis ──────────────────────────────────────────────────────────────────────

export interface ApiReview {
    id: string;
    user_id: string;
    hotel_id: string;
    booking_id: string;
    rating: number;
    title: string;
    comment: string;
    is_visible: boolean;
    created_at: string;
}
