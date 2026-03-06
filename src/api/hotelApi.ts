/**
 * src/api/hotelApi.ts
 *
 * Module API pour les hôtels.
 *
 * Responsabilité : effectuer les appels HTTP REST pour les hôtels.
 * Ce module est utilisé par HotelRepository.
 *
 * Séparation API / Repository :
 * - hotelApi : connaît les endpoints HTTP, les paramètres de requête
 * - HotelRepository : connaît les entités métier, fait la transformation
 *
 * En mode mock (développement sans backend), les repositories
 * utilisent mockData.ts au lieu de ces fonctions API.
 */

import apiClient from "@/api/apiClient";
import { ApiHotel, ApiPaginatedResponse } from "@/types/api.types";
import { SearchParams } from "@/interfaces/repositories/IHotelRepository";

/**
 * Recherche des hôtels via l'API.
 * @param params - Critères de recherche
 * @returns Réponse paginée de l'API (non transformée)
 */
export async function searchHotels(
    params: SearchParams
): Promise<ApiPaginatedResponse<ApiHotel>> {
    const response = await apiClient.get<ApiPaginatedResponse<ApiHotel>>("/hotels", {
        params: {
            city: params.city,
            check_in: params.checkIn.toISOString(),
            check_out: params.checkOut.toISOString(),
            guests: params.guestCount,
            min_price: params.minPrice,
            max_price: params.maxPrice,
            stars: params.stars?.join(","),
        },
    });
    return response.data;
}

/**
 * Récupère un hôtel par son id.
 * @param id - Identifiant de l'hôtel
 * @returns Hôtel brut depuis l'API
 */
export async function getHotelById(id: string): Promise<ApiHotel> {
    const response = await apiClient.get<ApiHotel>(`/hotels/${id}`);
    return response.data;
}