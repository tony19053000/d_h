import { requireUser } from '@/lib/session';
import { findRoom } from '@/lib/rooms';
import { BookingFormClient } from './BookingFormClient';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function BookingPage({
  params,
  searchParams,
}: {
  params: Promise<{ roomId: string }>;
  searchParams: Promise<{ checkIn?: string; checkOut?: string; guests?: string }>;
}) {
  const user = await requireUser();
  const { roomId } = await params;
  const { checkIn, checkOut, guests } = await searchParams;

  const room = await findRoom(roomId);
  if (!room) {
    notFound();
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <BookingFormClient
        room={room}
        currentUser={user}
        initialCheckIn={checkIn}
        initialCheckOut={checkOut}
        initialGuests={guests ? Number(guests) : undefined}
      />
    </main>
  );
}
