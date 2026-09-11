import { Reservation } from '@/types';
import { prisma } from './prisma';
import { findRoom } from './rooms';
import { nightsBetween } from './availability';

function mapDbReservation(r: any): Reservation {
  return {
    id: r.id,
    roomId: r.roomId,
    userId: r.userId,
    guestName: r.guestName,
    guestEmail: r.guestEmail,
    checkIn: r.checkIn,
    checkOut: r.checkOut,
    guests: r.guests,
    totalNights: r.totalNights,
    pricePerNight: r.pricePerNight,
    totalPrice: r.totalPrice,
    status: r.status as 'CONFIRMED' | 'CANCELLED',
    createdAt: r.createdAt ? new Date(r.createdAt).toISOString() : new Date().toISOString(),
    room: r.room
      ? {
          id: r.room.id,
          hotelId: r.room.hotelId,
          hotel: r.room.hotel
            ? {
                id: r.room.hotel.id,
                name: r.room.hotel.name,
                type: r.room.hotel.type,
                location: r.room.hotel.location,
                address: r.room.hotel.address,
                rating: r.room.hotel.rating,
                image: r.room.hotel.image,
                description: r.room.hotel.description,
                amenities:
                  typeof r.room.hotel.amenities === 'string'
                    ? JSON.parse(r.room.hotel.amenities)
                    : r.room.hotel.amenities || [],
              }
            : null,
          name: r.room.name,
          description: r.room.description,
          price: r.room.price,
          capacity: r.room.capacity,
          amenities: typeof r.room.amenities === 'string' ? JSON.parse(r.room.amenities) : r.room.amenities || [],
          images: typeof r.room.images === 'string' ? JSON.parse(r.room.images) : r.room.images || [],
          featured: r.room.featured,
          sizeSqFt: r.room.sizeSqFt,
          bedType: r.room.bedType,
          rating: r.room.rating,
        }
      : undefined,
  };
}

export async function listReservations(userId: string): Promise<Reservation[]> {
  if (!userId) return [];
  try {
    const dbReservations = await prisma.reservation.findMany({
      where: { userId },
      include: {
        room: {
          include: { hotel: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    return dbReservations.map(mapDbReservation);
  } catch (err) {
    console.error(`Failed to list reservations for user ${userId}:`, err);
    return [];
  }
}

export async function getReservation(id: string, userId: string): Promise<Reservation | undefined> {
  if (!id || !userId) return undefined;
  try {
    const res = await prisma.reservation.findUnique({
      where: { id },
      include: {
        room: {
          include: { hotel: true },
        },
      },
    });
    if (!res || res.userId !== userId) {
      return undefined;
    }
    return mapDbReservation(res);
  } catch (err) {
    console.error(`Failed to get reservation ${id}:`, err);
    return undefined;
  }
}

export async function createReservation(input: {
  roomId: string;
  guestName: string;
  guestEmail: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  userId: string;
}): Promise<Reservation> {
  const room = await findRoom(input.roomId);
  if (!room) {
    throw new Error(`Room with ID ${input.roomId} does not exist.`);
  }

  const nights = nightsBetween(input.checkIn, input.checkOut);
  if (nights <= 0) {
    throw new Error('Check-out date must be strictly after check-in date.');
  }

  const dbRes = await prisma.reservation.create({
    data: {
      roomId: input.roomId,
      userId: input.userId,
      guestName: input.guestName,
      guestEmail: input.guestEmail,
      checkIn: input.checkIn,
      checkOut: input.checkOut,
      guests: input.guests,
      totalNights: nights,
      pricePerNight: room.price,
      totalPrice: nights * room.price,
      status: 'CONFIRMED',
    },
    include: {
      room: {
        include: { hotel: true },
      },
    },
  });

  return mapDbReservation(dbRes);
}

export async function cancelReservation(id: string, userId: string): Promise<Reservation> {
  const existing = await prisma.reservation.findUnique({ where: { id } });
  if (!existing) {
    throw new Error('Reservation not found.');
  }
  if (existing.userId !== userId) {
    throw new Error('Unauthorized: You can only cancel your own reservations.');
  }

  const updated = await prisma.reservation.update({
    where: { id },
    data: { status: 'CANCELLED' },
    include: {
      room: {
        include: { hotel: true },
      },
    },
  });

  return mapDbReservation(updated);
}

export async function listAllConfirmedReservations(roomId?: string): Promise<Reservation[]> {
  try {
    const dbRes = await prisma.reservation.findMany({
      where: {
        status: 'CONFIRMED',
        ...(roomId ? { roomId } : {}),
      },
    });
    return dbRes.map(mapDbReservation);
  } catch (err) {
    console.error('Failed to list confirmed reservations:', err);
    return [];
  }
}
