import { requireUser } from '@/lib/session';
import { getReservation } from '@/lib/reservations';
import { findRoom } from '@/lib/rooms';
import { BookingDetailClient } from './BookingDetailClient';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function BookingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await requireUser();
  const { id } = await params;

  const reservation = await getReservation(id, user.id);
  if (!reservation) {
    notFound();
  }

  const room = await findRoom(reservation.roomId);
  if (!room) {
    notFound();
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <BookingDetailClient reservation={reservation} room={room} currentUser={user} />
    </main>
  );
}
