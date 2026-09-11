export interface Hotel {
  id: string;
  name: string;
  type: string;
  location: string;
  address?: string | null;
  rating: number;
  image: string;
  description: string;
  amenities: string[];
}

export interface Room {
  id: string;
  hotelId?: string | null;
  hotel?: Hotel | null;
  name: string;
  description: string;
  price: number; // price per night
  capacity: number; // max guests
  amenities: string[];
  images: string[];
  featured?: boolean;
  sizeSqFt?: number;
  bedType?: string;
  rating?: number;
}

export interface Availability {
  available: boolean;
  reason?: string;
  availableFrom?: string;
  conflictingDates?: string[];
}

export interface Reservation {
  id: string;
  roomId: string;
  userId: string;
  guestName: string;
  guestEmail: string;
  checkIn: string; // ISO date 'YYYY-MM-DD'
  checkOut: string; // ISO date 'YYYY-MM-DD'
  guests: number;
  totalNights: number;
  pricePerNight: number;
  totalPrice: number;
  status: 'CONFIRMED' | 'CANCELLED';
  createdAt: string;
  room?: Room;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string | null;
}
