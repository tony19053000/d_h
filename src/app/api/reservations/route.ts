import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/session';
import { listReservations, createReservation } from '@/lib/reservations';

export const dynamic = 'force-dynamic';

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized: Sign in required' }, { status: 401 });
  }

  const reservations = await listReservations(user.id);
  return NextResponse.json(reservations);
}

export async function POST(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized: Sign in required' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { roomId, guestName, guestEmail, checkIn, checkOut, guests } = body;

    if (!roomId || !checkIn || !checkOut || !guests) {
      return NextResponse.json(
        { error: 'Missing required booking fields (roomId, checkIn, checkOut, guests)' },
        { status: 400 }
      );
    }

    const reservation = await createReservation({
      roomId,
      guestName: guestName || user.name,
      guestEmail: guestEmail || user.email,
      checkIn,
      checkOut,
      guests: Number(guests),
      userId: user.id,
    });

    return NextResponse.json(reservation, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to create reservation' }, { status: 400 });
  }
}
