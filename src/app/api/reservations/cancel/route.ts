import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/session';
import { cancelReservation } from '@/lib/reservations';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized: Sign in required' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json({ error: 'Reservation ID is required' }, { status: 400 });
    }

    const cancelled = await cancelReservation(id, user.id);
    return NextResponse.json(cancelled);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to cancel reservation' }, { status: 400 });
  }
}
