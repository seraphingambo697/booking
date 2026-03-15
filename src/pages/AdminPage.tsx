/**
 * src/pages/AdminPage.tsx
 * Administration — CRUD hôtels + CRUD chambres par hôtel.
 */
import { useState, useEffect } from "react";
import {
    Plus, Pencil, Trash2, X, Save, Hotel,
    AlertTriangle, ChevronDown, ChevronRight, BedDouble,
} from "lucide-react";
import { hotelApi, roomApi } from "@/api/hotelApi";
import { apiClient } from "@/api/apiClient";
import { ApiHotel, ApiRoom } from "@/types/api.types";

const EMPTY_HOTEL = {
    name: "", description: "", address: "",
    city: "", country: "France", stars: 4,
    latitude: 0, longitude: 0, amenities: "", images: "",
};

const EMPTY_ROOM = {
    name: "", type: "DOUBLE", description: "",
    price_per_night: 100, capacity: 2, size_sqm: 25,
    bed_count: 1, bed_type: "Grand lit double",
    floor: 1, amenities: "", images: "", is_available: true,
};

const ROOM_TYPES = ["SINGLE", "DOUBLE", "TWIN", "SUITE", "DELUXE", "FAMILY"];

function Field({ label, name, value, onChange, type = "text", placeholder, multiline }: {
    label: string; name: string; value: string | number;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    type?: string; placeholder?: string; multiline?: boolean;
}) {
    const cls = "w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500";
    return (
        <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">{label}</label>
            {multiline
                ? <textarea name={name} value={value} onChange={onChange} rows={2} placeholder={placeholder} className={cls} />
                : <input type={type} name={name} value={value} onChange={onChange} placeholder={placeholder ?? label} className={cls} />
            }
        </div>
    );
}

export function AdminPage() {
    const [hotels, setHotels] = useState<ApiHotel[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [rooms, setRooms] = useState<Record<string, ApiRoom[]>>({});
    const [roomsLoading, setRoomsLoading] = useState<Record<string, boolean>>({});

    // Hôtel
    const [hotelModal, setHotelModal] = useState<"create" | "edit" | null>(null);
    const [editHotelId, setEditHotelId] = useState<string | null>(null);
    const [hotelForm, setHotelForm] = useState(EMPTY_HOTEL);
    const [savingHotel, setSavingHotel] = useState(false);
    const [deleteHotelId, setDeleteHotelId] = useState<string | null>(null);

    // Chambre
    const [roomModal, setRoomModal] = useState<"create" | "edit" | null>(null);
    const [curHotelId, setCurHotelId] = useState<string | null>(null);
    const [editRoomId, setEditRoomId] = useState<string | null>(null);
    const [roomForm, setRoomForm] = useState(EMPTY_ROOM);
    const [savingRoom, setSavingRoom] = useState(false);
    const [delRoom, setDelRoom] = useState<{ hotelId: string; roomId: string } | null>(null);

    const loadHotels = async () => {
        setLoading(true);
        try { setHotels(await hotelApi.listHotels({ page_size: 100 })); }
        catch { setError("Impossible de charger les hôtels."); }
        finally { setLoading(false); }
    };

    useEffect(() => { loadHotels(); }, []);

    const loadRooms = async (hotelId: string, force = false) => {
        if (rooms[hotelId] && !force) return;
        setRoomsLoading(p => ({ ...p, [hotelId]: true }));
        try {
            const data = await hotelApi.getRoomsByHotelId(hotelId);
            setRooms(p => ({ ...p, [hotelId]: data }));
        } catch { setError("Impossible de charger les chambres."); }
        finally { setRoomsLoading(p => ({ ...p, [hotelId]: false })); }
    };

    const toggle = (id: string) => {
        if (expandedId === id) { setExpandedId(null); }
        else { setExpandedId(id); loadRooms(id); }
    };

    // ── Hôtels ──────────────────────────────────────────────────────────────────

    const hotelChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setHotelForm(p => ({ ...p, [name]: name === "stars" ? Number(value) : value }));
    };

    const hotelPayload = () => ({
        ...hotelForm, stars: Number(hotelForm.stars),
        latitude: Number(hotelForm.latitude), longitude: Number(hotelForm.longitude),
        amenities: hotelForm.amenities.split(",").map(s => s.trim()).filter(Boolean),
        images: hotelForm.images.split(",").map(s => s.trim()).filter(Boolean),
    });

    const saveHotel = async () => {
        if (!hotelForm.name.trim() || !hotelForm.city.trim()) { setError("Nom et ville requis."); return; }
        setSavingHotel(true); setError(null);
        try {
            if (hotelModal === "create") { await apiClient.post("/hotels/", hotelPayload()); setSuccess(`Hôtel créé.`); }
            else if (editHotelId) { await apiClient.patch(`/hotels/${editHotelId}/`, hotelPayload()); setSuccess("Hôtel mis à jour."); }
            setHotelModal(null); await loadHotels();
        } catch (e: any) { setError(e.message ?? "Erreur."); }
        finally { setSavingHotel(false); }
    };

    const deleteHotel = async () => {
        if (!deleteHotelId) return;
        try { await apiClient.delete(`/hotels/${deleteHotelId}/`); setSuccess("Hôtel désactivé."); setDeleteHotelId(null); await loadHotels(); }
        catch (e: any) { setError(e.message ?? "Erreur."); }
    };

    // ── Chambres ────────────────────────────────────────────────────────────────

    const roomChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target as HTMLInputElement;
        setRoomForm(p => ({
            ...p,
            [name]: type === "checkbox"
                ? (e.target as HTMLInputElement).checked
                : ["price_per_night", "capacity", "size_sqm", "bed_count", "floor"].includes(name) ? Number(value) : value,
        }));
    };

    const roomPayload = () => ({
        name: roomForm.name, type: roomForm.type, description: roomForm.description,
        price_per_night: Number(roomForm.price_per_night), currency: "EUR",
        capacity: Number(roomForm.capacity), size_sqm: Number(roomForm.size_sqm),
        bed_count: Number(roomForm.bed_count), bed_type: roomForm.bed_type,
        floor: Number(roomForm.floor),
        amenities: roomForm.amenities.split(",").map(s => s.trim()).filter(Boolean),
        images: roomForm.images.split(",").map(s => s.trim()).filter(Boolean),
        is_available: roomForm.is_available,
    });

    const saveRoom = async () => {
        if (!roomForm.name.trim() || !curHotelId) { setError("Nom de chambre requis."); return; }
        setSavingRoom(true); setError(null);
        try {
            if (roomModal === "create") { await roomApi.createRoom(curHotelId, roomPayload()); setSuccess("Chambre créée."); }
            else if (editRoomId) { await roomApi.updateRoom(curHotelId, editRoomId, roomPayload()); setSuccess("Chambre mise à jour."); }
            setRoomModal(null);
            setRooms(p => { const n = { ...p }; delete n[curHotelId!]; return n; });
            loadRooms(curHotelId, true);
        } catch (e: any) { setError(e.message ?? "Erreur."); }
        finally { setSavingRoom(false); }
    };

    const deleteRoomFn = async () => {
        if (!delRoom) return;
        try {
            await roomApi.disableRoom(delRoom.hotelId, delRoom.roomId);
            setSuccess("Chambre désactivée."); setDelRoom(null);
            setRooms(p => { const n = { ...p }; delete n[delRoom.hotelId]; return n; });
            loadRooms(delRoom.hotelId, true);
        } catch (e: any) { setError(e.message ?? "Erreur."); }
    };

    // ── Rendu ────────────────────────────────────────────────────────────────────

    return (
        <div className="min-h-screen bg-slate-50 py-8 px-4">
            <div className="max-w-5xl mx-auto">

                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <Hotel className="h-6 w-6 text-blue-600" />
                        <h1 className="text-2xl font-bold text-slate-800">Gestion des hôtels</h1>
                        <span className="bg-slate-200 text-slate-600 text-xs font-semibold px-2 py-1 rounded-full">
                            {hotels.length} hôtel{hotels.length > 1 ? "s" : ""}
                        </span>
                    </div>
                    <button onClick={() => { setHotelForm(EMPTY_HOTEL); setEditHotelId(null); setHotelModal("create"); setError(null); }}
                        className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl font-semibold hover:bg-blue-700 text-sm">
                        <Plus className="h-4 w-4" /> Ajouter un hôtel
                    </button>
                </div>

                {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm flex gap-2"><AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />{error}</div>}
                {success && <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-xl text-sm">{success}</div>}

                {loading ? (
                    <div className="space-y-3">{[...Array(3)].map((_, i) => <div key={i} className="h-16 bg-white rounded-xl animate-pulse border" />)}</div>
                ) : (
                    <div className="space-y-2">
                        {hotels.length === 0 && <div className="text-center py-12 text-slate-400">Aucun hôtel.</div>}
                        {hotels.map(hotel => (
                            <div key={hotel.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">

                                {/* Ligne hôtel */}
                                <div className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50">
                                    <button onClick={() => toggle(hotel.id)} className="flex items-center gap-2 flex-1 min-w-0 text-left">
                                        {expandedId === hotel.id ? <ChevronDown className="h-4 w-4 text-slate-400 shrink-0" /> : <ChevronRight className="h-4 w-4 text-slate-400 shrink-0" />}
                                        <span className="font-semibold text-slate-800 truncate">{hotel.name}</span>
                                        <span className="text-sm text-slate-400 shrink-0">{hotel.city}</span>
                                        <span className="text-amber-400 shrink-0 text-sm">{"★".repeat(hotel.stars)}</span>
                                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full shrink-0 ${hotel.status === "ACTIVE" ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-500"}`}>
                                            {hotel.status === "ACTIVE" ? "Actif" : "Inactif"}
                                        </span>
                                    </button>
                                    <div className="flex gap-1 shrink-0">
                                        <button onClick={() => { setHotelForm({ name: hotel.name, description: hotel.description, address: hotel.address, city: hotel.city, country: hotel.country, stars: hotel.stars, latitude: hotel.latitude, longitude: hotel.longitude, amenities: hotel.amenities.join(", "), images: hotel.images.join(", ") }); setEditHotelId(hotel.id); setHotelModal("edit"); setError(null); }}
                                            className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"><Pencil className="h-4 w-4" /></button>
                                        <button onClick={() => { setDeleteHotelId(hotel.id); setError(null); }}
                                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg"><Trash2 className="h-4 w-4" /></button>
                                    </div>
                                </div>

                                {/* Chambres accordéon */}
                                {expandedId === hotel.id && (
                                    <div className="border-t border-slate-100 bg-slate-50 px-4 py-3">
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="flex items-center gap-2 text-sm font-semibold text-slate-600">
                                                <BedDouble className="h-4 w-4" />
                                                Chambres
                                                {rooms[hotel.id] && <span className="bg-slate-200 text-xs px-1.5 py-0.5 rounded-full">{rooms[hotel.id].length}</span>}
                                            </div>
                                            <button onClick={() => { setRoomForm(EMPTY_ROOM); setEditRoomId(null); setCurHotelId(hotel.id); setRoomModal("create"); setError(null); }}
                                                className="flex items-center gap-1.5 text-xs bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 font-semibold">
                                                <Plus className="h-3.5 w-3.5" /> Ajouter chambre
                                            </button>
                                        </div>

                                        {roomsLoading[hotel.id] ? (
                                            <div className="space-y-2">{[1, 2].map(i => <div key={i} className="h-10 bg-white rounded-lg animate-pulse" />)}</div>
                                        ) : !rooms[hotel.id] || rooms[hotel.id].length === 0 ? (
                                            <p className="text-xs text-slate-400 py-2">Aucune chambre — cliquez sur "Ajouter chambre".</p>
                                        ) : (
                                            <div className="space-y-1.5">
                                                {rooms[hotel.id].map(room => (
                                                    <div key={room.id} className="flex items-center justify-between bg-white rounded-xl px-3 py-2.5 border border-slate-100">
                                                        <div className="flex items-center gap-3 min-w-0 flex-wrap">
                                                            <span className="text-xs font-semibold bg-blue-50 text-blue-700 px-2 py-0.5 rounded-md shrink-0">{room.type}</span>
                                                            <span className="text-sm font-medium text-slate-800 truncate">{room.name}</span>
                                                            <span className="text-sm font-bold text-blue-600 shrink-0">{room.price_per_night} €/nuit</span>
                                                            <span className="text-xs text-slate-400 shrink-0">{room.capacity} pers. · {room.size_sqm}m²</span>
                                                            <span className={`text-xs px-1.5 py-0.5 rounded-full shrink-0 ${room.is_available ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>
                                                                {room.is_available ? "Dispo" : "Indispo"}
                                                            </span>
                                                        </div>
                                                        <div className="flex gap-1 shrink-0 ml-2">
                                                            <button onClick={() => { setRoomForm({ name: room.name, type: room.type, description: room.description, price_per_night: room.price_per_night, capacity: room.capacity, size_sqm: room.size_sqm, bed_count: room.bed_count, bed_type: room.bed_type, floor: room.floor, amenities: room.amenities.join(", "), images: room.images.join(", "), is_available: room.is_available }); setEditRoomId(room.id); setCurHotelId(hotel.id); setRoomModal("edit"); setError(null); }}
                                                                className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"><Pencil className="h-3.5 w-3.5" /></button>
                                                            <button onClick={() => setDelRoom({ hotelId: hotel.id, roomId: room.id })}
                                                                className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg"><Trash2 className="h-3.5 w-3.5" /></button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {/* Modale hôtel */}
                {hotelModal && (
                    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
                            <div className="flex items-center justify-between p-5 border-b">
                                <h2 className="text-lg font-semibold">{hotelModal === "create" ? "Ajouter un hôtel" : "Modifier l'hôtel"}</h2>
                                <button onClick={() => setHotelModal(null)}><X className="h-5 w-5 text-slate-400" /></button>
                            </div>
                            <div className="p-5 space-y-3">
                                {error && <p className="text-sm text-red-600 bg-red-50 p-2 rounded-lg">{error}</p>}
                                <Field label="Nom *" name="name" value={hotelForm.name} onChange={hotelChange} />
                                <Field label="Description" name="description" value={hotelForm.description} onChange={hotelChange} multiline />
                                <Field label="Adresse" name="address" value={hotelForm.address} onChange={hotelChange} />
                                <div className="grid grid-cols-2 gap-3">
                                    <Field label="Ville *" name="city" value={hotelForm.city} onChange={hotelChange} />
                                    <Field label="Pays" name="country" value={hotelForm.country} onChange={hotelChange} />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-slate-500 mb-1">Étoiles</label>
                                    <select name="stars" value={hotelForm.stars} onChange={hotelChange}
                                        className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                                        {[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n} étoile{n > 1 ? "s" : ""}</option>)}
                                    </select>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <Field label="Latitude" name="latitude" value={hotelForm.latitude} onChange={hotelChange} type="number" />
                                    <Field label="Longitude" name="longitude" value={hotelForm.longitude} onChange={hotelChange} type="number" />
                                </div>
                                <Field label="Équipements (virgule)" name="amenities" value={hotelForm.amenities} onChange={hotelChange} placeholder="WiFi, Piscine, Spa" />
                                <Field label="Images URL (virgule)" name="images" value={hotelForm.images} onChange={hotelChange} placeholder="https://..." />
                            </div>
                            <div className="flex justify-end gap-3 p-5 border-t">
                                <button onClick={() => setHotelModal(null)} className="px-4 py-2 text-sm border border-slate-200 rounded-xl hover:bg-slate-50">Annuler</button>
                                <button onClick={saveHotel} disabled={savingHotel}
                                    className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded-xl font-semibold hover:bg-blue-700 disabled:opacity-50 text-sm">
                                    <Save className="h-4 w-4" />{savingHotel ? "Enregistrement..." : "Enregistrer"}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Modale chambre */}
                {roomModal && (
                    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
                            <div className="flex items-center justify-between p-5 border-b">
                                <h2 className="text-lg font-semibold">{roomModal === "create" ? "Ajouter une chambre" : "Modifier la chambre"}</h2>
                                <button onClick={() => setRoomModal(null)}><X className="h-5 w-5 text-slate-400" /></button>
                            </div>
                            <div className="p-5 space-y-3">
                                {error && <p className="text-sm text-red-600 bg-red-50 p-2 rounded-lg">{error}</p>}
                                <Field label="Nom *" name="name" value={roomForm.name} onChange={roomChange} />
                                <div>
                                    <label className="block text-xs font-medium text-slate-500 mb-1">Type</label>
                                    <select name="type" value={roomForm.type} onChange={roomChange}
                                        className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                                        {ROOM_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                                    </select>
                                </div>
                                <Field label="Description" name="description" value={roomForm.description} onChange={roomChange} multiline />
                                <div className="grid grid-cols-2 gap-3">
                                    <Field label="Prix/nuit (€)" name="price_per_night" value={roomForm.price_per_night} onChange={roomChange} type="number" />
                                    <Field label="Capacité" name="capacity" value={roomForm.capacity} onChange={roomChange} type="number" />
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <Field label="Surface (m²)" name="size_sqm" value={roomForm.size_sqm} onChange={roomChange} type="number" />
                                    <Field label="Étage" name="floor" value={roomForm.floor} onChange={roomChange} type="number" />
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <Field label="Nb lits" name="bed_count" value={roomForm.bed_count} onChange={roomChange} type="number" />
                                    <Field label="Type de lit" name="bed_type" value={roomForm.bed_type} onChange={roomChange} placeholder="Grand lit double" />
                                </div>
                                <Field label="Équipements (virgule)" name="amenities" value={roomForm.amenities} onChange={roomChange} placeholder="WiFi, TV, Minibar" />
                                <Field label="Images URL (virgule)" name="images" value={roomForm.images} onChange={roomChange} placeholder="https://..." />
                                <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                                    <input type="checkbox" name="is_available" checked={roomForm.is_available} onChange={roomChange}
                                        className="h-4 w-4 rounded border-slate-300" />
                                    Chambre disponible à la réservation
                                </label>
                            </div>
                            <div className="flex justify-end gap-3 p-5 border-t">
                                <button onClick={() => setRoomModal(null)} className="px-4 py-2 text-sm border border-slate-200 rounded-xl hover:bg-slate-50">Annuler</button>
                                <button onClick={saveRoom} disabled={savingRoom}
                                    className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded-xl font-semibold hover:bg-blue-700 disabled:opacity-50 text-sm">
                                    <Save className="h-4 w-4" />{savingRoom ? "Enregistrement..." : "Enregistrer"}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Confirm suppression hôtel */}
                {deleteHotelId && (
                    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">
                            <div className="flex gap-3 mb-4">
                                <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                                    <Trash2 className="h-5 w-5 text-red-600" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-slate-800">Supprimer l'hôtel ?</h3>
                                    <p className="text-sm text-slate-500 mt-0.5">L'hôtel sera désactivé (soft delete).</p>
                                </div>
                            </div>
                            <div className="flex gap-3 justify-end">
                                <button onClick={() => setDeleteHotelId(null)} className="px-4 py-2 text-sm border border-slate-200 rounded-xl hover:bg-slate-50">Annuler</button>
                                <button onClick={deleteHotel} className="bg-red-600 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-red-700">Confirmer</button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Confirm suppression chambre */}
                {delRoom && (
                    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">
                            <div className="flex gap-3 mb-4">
                                <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                                    <BedDouble className="h-5 w-5 text-red-600" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-slate-800">Désactiver la chambre ?</h3>
                                    <p className="text-sm text-slate-500 mt-0.5">Elle ne sera plus disponible à la réservation.</p>
                                </div>
                            </div>
                            <div className="flex gap-3 justify-end">
                                <button onClick={() => setDelRoom(null)} className="px-4 py-2 text-sm border border-slate-200 rounded-xl hover:bg-slate-50">Annuler</button>
                                <button onClick={deleteRoomFn} className="bg-red-600 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-red-700">Confirmer</button>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}