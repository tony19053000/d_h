import { Availability } from '@/types';
import { findRoom } from './rooms';
import { listAllConfirmedReservations } from './reservations';

export function nightsBetween(checkIn: string, checkOut: string): number {
  if (!checkIn || !checkOut) return 0;
  const start = new Date(checkIn);
  const end = new Date(checkOut);
  if (isNaN(start.getTime()) || isNaN(end.getTime())) return 0;
  const diffTime = end.getTime() - start.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays > 0 ? diffDays : 0;
}

export async function checkAvailability(
  roomId: string,
  checkIn: string,
  checkOut: string
): Promise<Availability> {
  const room = await findRoom(roomId);
  if (!room) {
    return {
      available: false,
      reason: 'Room not found.',
    };
  }

  if (!checkIn || !checkOut) {
    return {
      available: false,
      reason: 'Check-in and check-out dates are required.',
    };
  }

  const nights = nightsBetween(checkIn, checkOut);
  if (nights <= 0) {
    return {
      available: false,
      reason: 'Check-out date must be after check-in date.',
    };
  }

  const confirmedReservations = await listAllConfirmedReservations(roomId);
  const conflicting = confirmedReservations.filter((res) => {
    // Overlap condition: res.checkIn < checkOut AND res.checkOut > checkIn
    return res.checkIn < checkOut && res.checkOut > checkIn;
  });

  if (conflicting.length > 0) {
    const conflictingDates = conflicting.map((c) => `${c.checkIn} to ${c.checkOut}`);
    return {
      available: false,
      reason: 'The selected dates conflict with an existing reservation.',
      conflictingDates,
    };
  }

  return {
    available: true,
  };
}
