/**
 * src/hooks/useHotelDetail.ts
 *
 * Hook : page de détail d'un hôtel (HotelDetailPage).
 *
 * Charge l'hôtel ET ses chambres dès que l'hotelId change.
 * Expose onRoomSelect pour la sélection visuelle d'une chambre.
 */

import { useState, useEffect, useRef, useCallback } from "react";
import { HotelDetailPresenter } from "@/presenters/HotelDetailPresenter";
import { HotelDetailViewModel } from "@/viewmodels/HotelDetailViewModel";
import { HotelService } from "@/services/HotelService";
import { HotelRepository } from "@/repositories/HotelRepository";
import { RoomRepository } from "@/repositories/RoomRepository";

const hotelRepository = new HotelRepository();
const hotelService = new HotelService(hotelRepository);
const roomRepository = new RoomRepository();

export function useHotelDetail(hotelId: string) {
    const [vm, setVm] = useState<HotelDetailViewModel>({
        id: "", name: "", description: "", address: "", city: "", country: "",
        stars: 0, rating: 0, reviewCount: "", images: [], amenities: [],
        rooms: [], isLoading: true, hasError: false,
    });

    const presenterRef = useRef(
        new HotelDetailPresenter(hotelService, roomRepository, setVm)
    );

    useEffect(() => {
        if (hotelId) {
            presenterRef.current.loadHotel(hotelId);
        }
    }, [hotelId]);

    const onRoomSelect = useCallback(
        (roomId: string) => presenterRef.current.onRoomSelect(roomId),
        []
    );

    return { vm, onRoomSelect };
}