/**
 * src/pages/MyBookingsPage.tsx
 * Liste des réservations de l'utilisateur connecté.
 */

import { useNavigate } from "react-router-dom";
import { BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useMyBookings } from "@/hooks/useMyBookings";
import { ROUTES } from "@/router/routes";

export function MyBookingsPage() {
    const navigate = useNavigate();
    const { vm } = useMyBookings();

    return (
        <div className="container py-8 max-w-4xl">
            <h1 className="text-2xl font-bold mb-6">Mes réservations</h1>

            {/* Skeletons pendant le chargement */}
            {vm.isLoading && (
                <div className="space-y-4">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <Skeleton key={i} className="h-32 w-full rounded-xl" />
                    ))}
                </div>
            )}

            {/* État vide */}
            {vm.isEmpty && !vm.isLoading && (
                <div className="text-center py-16">
                    <BookOpen className="h-16 w-16 mx-auto mb-4 text-muted-foreground/30" />
                    <h2 className="text-xl font-semibold mb-2">Aucune réservation</h2>
                    <p className="text-muted-foreground mb-4">
                        Vous n'avez pas encore effectué de réservation.
                    </p>
                    <Button onClick={() => navigate(ROUTES.HOME)}>Commencer à chercher</Button>
                </div>
            )}

            {/* Liste des réservations */}
            <div className="space-y-4">
                {vm.bookings.map((booking) => (
                    <Card key={booking.id} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-5">
                            <div className="flex justify-between items-start">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <h3 className="font-semibold">{booking.hotelName}</h3>
                                        {/* statusColor est une variante shadcn typée */}
                                        <Badge variant={booking.statusColor}>{booking.status}</Badge>
                                    </div>
                                    <p className="text-sm text-muted-foreground">{booking.roomName}</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-lg text-primary">{booking.totalPrice}</p>
                                    <p className="text-xs text-muted-foreground font-mono">{booking.bookingRef}</p>
                                </div>
                            </div>

                            <div className="flex gap-6 mt-3 text-sm text-muted-foreground">
                                <span>📅 {booking.checkIn} → {booking.checkOut}</span>
                                <span>🌙 {booking.nights}</span>
                            </div>

                            <div className="flex justify-end mt-3">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => navigate(ROUTES.BOOKING_CONFIRMATION(booking.id))}
                                >
                                    Voir les détails
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}