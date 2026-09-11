import { requireUser } from '@/lib/session';
import { listReservations } from '@/lib/reservations';
import { listRooms } from '@/lib/rooms';
import { Room } from '@/types';
import { AccountClient } from './AccountClient';

export const dynamic = 'force-dynamic';

export default async function AccountPage() {
  const user = await requireUser();
  const reservations = await listReservations(user.id);
  const rooms = await listRooms();

  const roomsMap: Record<string, Room> = {};
  rooms.forEach((room) => {
    roomsMap[room.id] = room;
  });

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <AccountClient user={user} reservations={reservations} roomsMap={roomsMap} />
    </main>
  );
}
