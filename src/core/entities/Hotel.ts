export interface Hotel {
    id: string;
    name: string;
    description: string;
    address: string;
    city: string;
    country: string;
    latitude: number;
    longitude: number;
    stars: number;
    rating: number;
    reviewCount: number;
    images: string[];
    amenities: string[];
    priceFrom: number;
    currency: string;
}