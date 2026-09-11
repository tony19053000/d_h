'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Reservation, Room, User } from '@/types';
import {
  ChevronLeft,
  Calendar,
  Users,
  AlertTriangle,
  XCircle,
  Lock,
  Printer,
} from 'lucide-react';

interface BookingDetailClientProps {
  reservation: Reservation;
  room: Room;
  currentUser: User;
}

export function BookingDetailClient({
  reservation: initialReservation,
  room,
  currentUser,
}: BookingDetailClientProps) {
  const [reservation, setReservation] = useState<Reservation>(initialReservation);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [cancelError, setCancelError] = useState<string | null>(null);

  const isCancelled = reservation.status === 'CANCELLED';

  const handleConfirmCancel = async () => {
    setCancelError(null);
    setCancelling(true);

    try {
      const res = await fetch('/api/reservations/cancel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: reservation.id }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to cancel reservation');
      }

      setReservation(data);
      setShowCancelModal(false);
      setCancelling(false);
    } catch (err: any) {
      setCancelError(err.message || 'An error occurred during cancellation.');
      setCancelling(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 bg-white">
      {/* Navigation Breadcrumb */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <Link
          href="/account"
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to My Bookings</span>
        </Link>
        <span className="text-xs font-mono text-slate-400">Reservation Ref: {reservation.id}</span>
      </div>

      {/* Booking Header Banner */}
      <div className="bg-white border border-slate-200/90 p-6 sm:p-8 rounded-3xl space-y-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-extrabold text-slate-900">Reservation Details</h1>
              <span
                className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                  isCancelled
                    ? 'bg-rose-50 border border-rose-200 text-rose-700'
                    : 'bg-emerald-50 border border-emerald-200 text-emerald-800'
                }`}
              >
                {reservation.status}
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Booked on {new Date(reservation.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => window.print()}
              className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 rounded-xl transition-colors inline-flex items-center gap-1.5"
            >
              <Printer className="w-4 h-4" /> Print Confirmation
            </button>
          </div>
        </div>

        {/* Room & Dates Summary Card */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          <div className="md:col-span-4 h-44 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={room.images[0]} alt={room.name} className="w-full h-full object-cover" />
          </div>

          <div className="md:col-span-8 space-y-3">
            <h3 className="text-xl font-extrabold text-slate-900">{room.name}</h3>
            <p className="text-xs text-slate-500 leading-relaxed">{room.description}</p>
            <div className="flex flex-wrap gap-2 pt-1">
              {room.amenities.slice(0, 4).map((a) => (
                <span key={a} className="px-2.5 py-1 bg-slate-100 text-[11px] font-medium text-slate-700 rounded-lg">
                  {a}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-slate-200">
          <div className="p-4 bg-slate-50 rounded-2xl space-y-1">
            <p className="text-[10px] uppercase font-extrabold text-slate-400 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-700" /> Check-In Date
            </p>
            <p className="font-bold text-sm text-slate-900">{reservation.checkIn}</p>
            <p className="text-[11px] text-slate-500">After 3:00 PM</p>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl space-y-1">
            <p className="text-[10px] uppercase font-extrabold text-slate-400 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-700" /> Check-Out Date
            </p>
            <p className="font-bold text-sm text-slate-900">{reservation.checkOut}</p>
            <p className="text-[11px] text-slate-500">Before 11:00 AM</p>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl space-y-1">
            <p className="text-[10px] uppercase font-extrabold text-slate-400 flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-slate-700" /> Occupancy
            </p>
            <p className="font-bold text-sm text-slate-900">{reservation.guests} Guests</p>
            <p className="text-[11px] text-slate-500">{reservation.totalNights} Nights</p>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl space-y-1">
            <p className="text-[10px] uppercase font-extrabold text-slate-400">Total Paid</p>
            <p className="font-black text-lg text-slate-900">${reservation.totalPrice}</p>
            <p className="text-[11px] text-slate-500">${reservation.pricePerNight} / night</p>
          </div>
        </div>

        {/* Guest Info */}
        <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">Registered Guest</p>
            <p className="text-sm font-extrabold text-slate-900 mt-0.5">{reservation.guestName} ({reservation.guestEmail})</p>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Lock className="w-4 h-4 text-emerald-600" />
            <span>Scoped to User {currentUser.name}</span>
          </div>
        </div>

        {/* Cancellation Section */}
        {!isCancelled ? (
          <div className="p-6 bg-rose-50/50 border border-rose-200/80 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-600" /> Cancel Reservation
              </h4>
              <p className="text-xs text-slate-600">
                Need to change plans? You can cancel this booking at any time.
              </p>
            </div>
            <button
              onClick={() => setShowCancelModal(true)}
              className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl transition-colors whitespace-nowrap shadow-xs"
            >
              Cancel Booking
            </button>
          </div>
        ) : (
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-center gap-3 text-rose-700 text-xs font-semibold">
            <XCircle className="w-5 h-5 flex-shrink-0 text-rose-600" />
            <span>This booking has been cancelled. No cancellation penalty applies.</span>
          </div>
        )}
      </div>

      {/* Consequential Confirmation Modal Dialog */}
      {showCancelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-6 shadow-2xl">
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl w-fit text-rose-600 mx-auto">
              <AlertTriangle className="w-8 h-8" />
            </div>

            <div className="text-center space-y-2">
              <h3 className="text-xl font-extrabold text-slate-900">Cancel Reservation?</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Are you sure you want to cancel your reservation for <strong className="text-slate-900">{room.name}</strong>?
              </p>
              <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-900 text-left space-y-1 mt-2">
                <p className="font-bold flex items-center gap-1 text-rose-700">
                  <AlertTriangle className="w-4 h-4" /> Permanent Cancellation
                </p>
                <p className="leading-normal text-rose-800">
                  This action cannot be undone. Reserved dates ({reservation.checkIn} to {reservation.checkOut}) will be immediately released to other guests.
                </p>
              </div>
            </div>

            {cancelError && (
              <p className="text-xs font-semibold text-rose-600 text-center">{cancelError}</p>
            )}

            <div className="flex flex-col sm:flex-row items-center gap-3">
              <button
                type="button"
                onClick={() => setShowCancelModal(false)}
                disabled={cancelling}
                className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition-colors"
              >
                Keep Reservation
              </button>
              <button
                type="button"
                onClick={handleConfirmCancel}
                disabled={cancelling}
                className="w-full py-3 bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
              >
                {cancelling ? (
                  <span>Cancelling...</span>
                ) : (
                  <span>Yes, Cancel Reservation</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
