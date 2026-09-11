import { listRooms } from '@/lib/rooms';
import { RoomsClient } from './RoomsClient';
import { Suspense } from 'react';

export default async function RoomsPage() {
  const rooms = await listRooms();

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Suspense fallback={<div className="text-slate-900 text-center py-20 font-bold">Loading Accommodations...</div>}>
        <RoomsClient initialRooms={rooms} />
      </Suspense>
    </main>
  );
}
