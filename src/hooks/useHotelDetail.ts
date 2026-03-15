/**
 * src/hooks/useHotelDetail.ts
 * Hook React pour la page de détail d'un hôtel.
 */
import { useState, useRef, useEffect, useCallback } from "react";
import { HotelDetailPresenter } from "@/presenters/HotelDetailPresenter";
import { HotelDetailViewModel } from "@/viewmodels/HotelDetailViewModel";
import { HotelRepository } from "@/repositories/HotelRepository";
import { RoomRepository } from "@/repositories/RoomRepository";
import { HotelService } from "@/services/HotelService";

const hotelRepo = new HotelRepository();
const roomRepo = new RoomRepository();
const hotelService = new HotelService(hotelRepo);

export function useHotelDetail(hotelId: string) {
  const [vm, setVm] = useState<HotelDetailViewModel>({
    id: "", name: "", description: "", address: "", city: "", country: "",
    stars: 0, rating: 0, reviewCount: "", images: [], amenities: [],
    rooms: [], isLoading: true, hasError: false,
  });

  const presenterRef = useRef(
    new HotelDetailPresenter(hotelService, roomRepo, setVm)
  );

  /* Charge l'hôtel quand l'ID change (navigation entre hôtels) */
  useEffect(() => {
    if (hotelId) {
      presenterRef.current.loadHotel(hotelId);
    }
  }, [hotelId]);

  const onRoomSelect = useCallback((roomId: string) => {
    presenterRef.current.onRoomSelect(roomId);
  }, []);

  return { vm, onRoomSelect };
}
