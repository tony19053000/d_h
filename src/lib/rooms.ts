import { Room, Hotel } from '@/types';
import { prisma } from './prisma';

function mapDbHotel(hotel: any): Hotel {
  return {
    id: hotel.id,
    name: hotel.name,
    type: hotel.type,
    location: hotel.location,
    address: hotel.address,
    rating: hotel.rating,
    image: hotel.image,
    description: hotel.description,
    amenities: typeof hotel.amenities === 'string' ? JSON.parse(hotel.amenities) : hotel.amenities || [],
  };
}

function mapDbRoom(room: any): Room {
  return {
    id: room.id,
    hotelId: room.hotelId,
    hotel: room.hotel ? mapDbHotel(room.hotel) : null,
    name: room.name,
    description: room.description,
    price: room.price,
    capacity: room.capacity,
    amenities: typeof room.amenities === 'string' ? JSON.parse(room.amenities) : room.amenities || [],
    images: typeof room.images === 'string' ? JSON.parse(room.images) : room.images || [],
    featured: room.featured,
    sizeSqFt: room.sizeSqFt,
    bedType: room.bedType,
    rating: room.rating,
  };
}

export async function listHotels(): Promise<Hotel[]> {
  try {
    const dbHotels = await prisma.hotel.findMany({
      orderBy: { rating: 'desc' },
    });
    return dbHotels.map(mapDbHotel);
  } catch (err) {
    console.error('Failed to list hotels from DB:', err);
    return [];
  }
}

export async function listRooms(): Promise<Room[]> {
  try {
    const dbRooms = await prisma.room.findMany({
      include: { hotel: true },
      orderBy: { rating: 'desc' },
    });
    return dbRooms.map(mapDbRoom);
  } catch (err) {
    console.error('Failed to list rooms from DB:', err);
    return [];
  }
}

export async function findRoom(roomId: string): Promise<Room | undefined> {
  try {
    const dbRoom = await prisma.room.findUnique({
      where: { id: roomId },
      include: { hotel: true },
    });
    if (!dbRoom) return undefined;
    return mapDbRoom(dbRoom);
  } catch (err) {
    console.error(`Failed to find room ${roomId}:`, err);
    return undefined;
  }
}

export async function searchRooms(params: {
  guests?: number;
  maxPrice?: number;
  amenities?: string[];
  hotelId?: string;
  location?: string;
}): Promise<Room[]> {
  try {
    const dbRooms = await prisma.room.findMany({
      include: { hotel: true },
      orderBy: { price: 'asc' },
    });

    const mapped = dbRooms.map(mapDbRoom);

    return mapped.filter((room) => {
      if (params.guests && room.capacity < params.guests) return false;
      if (params.maxPrice && room.price > params.maxPrice) return false;
      if (params.hotelId && room.hotelId !== params.hotelId) return false;
      if (
        params.location &&
        room.hotel &&
        !room.hotel.location.toLowerCase().includes(params.location.toLowerCase())
      ) {
        return false;
      }
      if (params.amenities && params.amenities.length > 0) {
        const hasAll = params.amenities.every((a) =>
          room.amenities.some((ra) => ra.toLowerCase().includes(a.toLowerCase()))
        );
        if (!hasAll) return false;
      }
      return true;
    });
  } catch (err) {
    console.error('Failed to search rooms:', err);
    return [];
  }
}
