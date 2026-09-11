'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Reservation, User, Room } from '@/types';
import { CalendarCheck, CalendarX, ArrowRight, BedDouble, Shield, LogOut } from 'lucide-react';

interface AccountClientProps {
  user: User;
  reservations: Reservation[];
  roomsMap: Record<string, Room>;
}

export function AccountClient({ user, reservations, roomsMap }: AccountClientProps) {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past' | 'all'>('upcoming');

  const today = new Date().toISOString().split('T')[0];

  const upcomingReservations = reservations.filter(
    (r) => r.status === 'CONFIRMED' && r.checkOut >= today
  );
  const pastReservations = reservations.filter(
    (r) => r.status === 'CANCELLED' || r.checkOut < today
  );

  const displayedReservations =
    activeTab === 'upcoming'
      ? upcomingReservations
      : activeTab === 'past'
      ? pastReservations
      : reservations;

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    window.location.href = '/login';
  };

  return (
    <div className="space-y-8 bg-white">
      {/* User Banner */}
      <div className="bg-slate-50 border border-slate-200/80 p-6 sm:p-8 rounded-3xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-xs">
        <div className="flex items-center gap-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={user.avatar || 'https://picsum.photos/id/64/150/150'}
            alt={user.name}
            className="w-14 h-14 rounded-full object-cover ring-2 ring-slate-300"
          />
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900">{user.name}</h1>
            <p className="text-xs text-slate-500 mt-0.5">{user.email}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-100 text-xs font-bold text-slate-700 rounded-xl transition-colors shadow-2xs"
          >
            Switch Account
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-4 py-2 bg-rose-50 border border-rose-200 hover:bg-rose-100 text-xs font-bold text-rose-700 rounded-xl transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" /> Sign Out
          </button>
        </div>
      </div>

      {/* Tabs Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('upcoming')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'upcoming'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 bg-slate-100'
            }`}
          >
            Upcoming Bookings ({upcomingReservations.length})
          </button>
          <button
            onClick={() => setActiveTab('past')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'past'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 bg-slate-100'
            }`}
          >
            Past & Cancelled ({pastReservations.length})
          </button>
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'all'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 bg-slate-100'
            }`}
          >
            All Reservations ({reservations.length})
          </button>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-slate-500">
          <Shield className="w-4 h-4 text-emerald-600" />
          <span>User-Scoped Reservations</span>
        </div>
      </div>

      {/* Reservation List Grid */}
      {displayedReservations.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {displayedReservations.map((res) => {
            const room = roomsMap[res.roomId];
            const isCancelled = res.status === 'CANCELLED';

            return (
              <div
                key={res.id}
                className={`bg-white border ${
                  isCancelled ? 'border-slate-200 opacity-75' : 'border-slate-200/90 shadow-xs'
                } rounded-3xl p-6 space-y-4 flex flex-col justify-between`}
              >
                <div className="space-y-4">
                  {/* Top info */}
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono text-slate-400">ID: {res.id}</span>
                    <span
                      className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                        isCancelled
                          ? 'bg-rose-50 border border-rose-200 text-rose-700'
                          : 'bg-emerald-50 border border-emerald-200 text-emerald-800'
                      }`}
                    >
                      {res.status}
                    </span>
                  </div>

                  {/* Room Thumbnail & Title */}
                  <div className="flex items-center gap-4">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={room?.images[0] || 'https://picsum.photos/id/1040/1200/800'}
                      alt={room?.name || 'Room'}
                      className="w-20 h-20 rounded-2xl object-cover border border-slate-200"
                    />
                    <div>
                      <h3 className="font-bold text-base text-slate-900">{room?.name || res.roomId}</h3>
                      <p className="text-xs text-slate-500 font-semibold mt-0.5">
                        ${res.pricePerNight} / night • {res.totalNights} Nights
                      </p>
                      <p className="text-xs text-slate-600 mt-1">Guest: {res.guestName}</p>
                    </div>
                  </div>

                  {/* Dates & Price Specs */}
                  <div className="grid grid-cols-2 gap-3 p-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-xs">
                    <div>
                      <p className="text-[10px] uppercase font-extrabold text-slate-400">Check-In</p>
                      <p className="font-bold text-slate-900 mt-0.5">{res.checkIn}</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-extrabold text-slate-400">Check-Out</p>
                      <p className="font-bold text-slate-900 mt-0.5">{res.checkOut}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                  <div>
                    <p className="text-[10px] uppercase font-extrabold text-slate-400">Total Price</p>
                    <p className="text-lg font-black text-slate-900">${res.totalPrice}</p>
                  </div>

                  <Link
                    href={`/account/bookings/${res.id}`}
                    className="px-4 py-2.5 bg-slate-900 hover:bg-sky-950 text-xs font-bold text-white rounded-xl transition-all inline-flex items-center gap-1.5 shadow-2xs"
                  >
                    <span>View Details</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-slate-50 border border-slate-200 border-dashed rounded-3xl p-12 text-center space-y-4">
          <div className="p-4 bg-white border border-slate-200 rounded-2xl w-fit mx-auto text-slate-400">
            {activeTab === 'past' ? <CalendarX className="w-8 h-8" /> : <CalendarCheck className="w-8 h-8" />}
          </div>
          <h3 className="text-xl font-bold text-slate-900">No {activeTab} Bookings Found</h3>
          <p className="text-sm text-slate-500 max-w-md mx-auto">
            You do not have any {activeTab} reservations under <strong className="text-slate-900">{user.name}</strong>.
          </p>
          <Link
            href="/rooms"
            className="px-6 py-2.5 bg-slate-900 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-sm hover:bg-slate-800 transition-all inline-flex items-center gap-2"
          >
            <BedDouble className="w-4 h-4" /> Explore Accommodations
          </Link>
        </div>
      )}
    </div>
  );
}
