import { findRoom } from '@/lib/rooms';
import { RoomDetailClient } from './RoomDetailClient';
import { notFound } from 'next/navigation';

export default async function RoomDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const room = await findRoom(id);

  if (!room) {
    notFound();
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <RoomDetailClient room={room} />
    </main>
  );
}
