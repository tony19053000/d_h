'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Room, User } from '@/types';
import { nightsBetween } from '@/lib/availability';
import {
  Calendar,
  Users,
  User as UserIcon,
  ShieldCheck,
  AlertCircle,
  CreditCard,
  CheckCircle2,
  Lock,
} from 'lucide-react';

interface BookingFormClientProps {
  room: Room;
  currentUser: User;
  initialCheckIn?: string;
  initialCheckOut?: string;
  initialGuests?: number;
}

export function BookingFormClient({
  room,
  currentUser,
  initialCheckIn = '2026-09-20',
  initialCheckOut = '2026-09-24',
  initialGuests = 2,
}: BookingFormClientProps) {
  const router = useRouter();

  const [guestName, setGuestName] = useState(currentUser.name);
  const [guestEmail, setGuestEmail] = useState(currentUser.email);
  const [checkIn, setCheckIn] = useState(initialCheckIn);
  const [checkOut, setCheckOut] = useState(initialCheckOut);
  const [guests, setGuests] = useState(initialGuests);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const nights = nightsBetween(checkIn, checkOut);
  const totalPrice = nights * room.price;

  const validateForm = (): boolean => {
    const errs: Record<string, string> = {};

    if (!guestName.trim()) {
      errs.guestName = 'Full Name is required.';
    }
    if (!guestEmail.trim() || !/\S+@\S+\.\S+/.test(guestEmail)) {
      errs.guestEmail = 'Valid Email Address is required.';
    }
    if (!checkIn) {
      errs.checkIn = 'Check-in date is required.';
    }
    if (!checkOut) {
      errs.checkOut = 'Check-out date is required.';
    }
    if (checkIn && checkOut && nights <= 0) {
      errs.checkOut = 'Check-out date must be after check-in date.';
    }
    if (guests < 1 || guests > room.capacity) {
      errs.guests = `Guest count must be between 1 and ${room.capacity}.`;
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);

    if (!validateForm()) return;

    setSubmitting(true);
    try {
      const res = await fetch('/api/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roomId: room.id,
          guestName,
          guestEmail,
          checkIn,
          checkOut,
          guests,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to complete reservation');
      }

      window.location.href = `/account/bookings/${data.id}`;
    } catch (err: any) {
      setServerError(err.message || 'An error occurred during booking.');
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 bg-white">
      {/* Header */}
      <div className="border-b border-slate-200 pb-6 text-center sm:text-left">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-slate-100 border border-slate-200 text-slate-800 text-xs font-bold rounded-full mb-3">
          <Lock className="w-3.5 h-3.5 text-sky-800" /> Secure Checkout
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900">Confirm Your Reservation</h1>
        <p className="text-sm text-slate-500 mt-1">
          Complete guest details to confirm your stay at Seaside Hotel.
        </p>
      </div>

      {serverError && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-center gap-3 text-rose-700 text-sm font-semibold">
          <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-600" />
          <span>{serverError}</span>
        </div>
      )}

      {/* Form & Summary Layout */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Guest Details Form (7 cols) */}
        <div className="lg:col-span-7 bg-slate-50 border border-slate-200/80 p-6 sm:p-8 rounded-3xl space-y-6">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b border-slate-200 pb-3">
            <UserIcon className="w-5 h-5 text-slate-800" /> Guest Details
          </h2>

          {/* User Session Info */}
          <div className="p-3.5 bg-white border border-slate-200 rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={currentUser.avatar || 'https://picsum.photos/id/64/150/150'} alt="" className="w-8 h-8 rounded-full object-cover" />
              <div>
                <p className="text-xs font-bold text-slate-900">{currentUser.name}</p>
                <p className="text-[11px] text-slate-500">{currentUser.email}</p>
              </div>
            </div>
          </div>

          {/* Full Name Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Primary Guest Full Name
            </label>
            <input
              type="text"
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              className={`w-full bg-white border ${
                errors.guestName ? 'border-rose-500' : 'border-slate-200'
              } rounded-xl px-3.5 py-3 text-sm text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-slate-900`}
              placeholder="e.g. Alice Chen"
            />
            {errors.guestName && (
              <p className="text-xs font-semibold text-rose-600">{errors.guestName}</p>
            )}
          </div>

          {/* Email Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Confirmation Email Address
            </label>
            <input
              type="email"
              value={guestEmail}
              onChange={(e) => setGuestEmail(e.target.value)}
              className={`w-full bg-white border ${
                errors.guestEmail ? 'border-rose-500' : 'border-slate-200'
              } rounded-xl px-3.5 py-3 text-sm text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-slate-900`}
              placeholder="e.g. alice.chen@example.com"
            />
            {errors.guestEmail && (
              <p className="text-xs font-semibold text-rose-600">{errors.guestEmail}</p>
            )}
          </div>

          {/* Dates Selection */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-700" /> Check-In
              </label>
              <input
                type="date"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                className={`w-full bg-white border ${
                  errors.checkIn ? 'border-rose-500' : 'border-slate-200'
                } rounded-xl px-3 py-2.5 text-xs text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-slate-900`}
              />
              {errors.checkIn && (
                <p className="text-xs font-semibold text-rose-600">{errors.checkIn}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-700" /> Check-Out
              </label>
              <input
                type="date"
                value={checkOut}
                min={checkIn}
                onChange={(e) => setCheckOut(e.target.value)}
                className={`w-full bg-white border ${
                  errors.checkOut ? 'border-rose-500' : 'border-slate-200'
                } rounded-xl px-3 py-2.5 text-xs text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-slate-900`}
              />
              {errors.checkOut && (
                <p className="text-xs font-semibold text-rose-600">{errors.checkOut}</p>
              )}
            </div>
          </div>

          {/* Guest Count */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-slate-700" /> Number of Guests
            </label>
            <select
              value={guests}
              onChange={(e) => setGuests(Number(e.target.value))}
              className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-3 text-sm text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-slate-900"
            >
              {Array.from({ length: room.capacity }, (_, i) => i + 1).map((num) => (
                <option key={num} value={num}>
                  {num} {num === 1 ? 'Guest' : 'Guests'} (Max {room.capacity})
                </option>
              ))}
            </select>
            {errors.guests && (
              <p className="text-xs font-semibold text-rose-600">{errors.guests}</p>
            )}
          </div>
        </div>

        {/* Right Column: Reservation Price Summary (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white border border-slate-200 p-6 sm:p-8 rounded-3xl space-y-6 shadow-xl">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b border-slate-200 pb-3">
              <CreditCard className="w-5 h-5 text-slate-800" /> Summary
            </h2>

            {/* Room Card Preview */}
            <div className="flex items-center gap-4 p-3 bg-slate-50 border border-slate-200/80 rounded-2xl">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={room.images[0]}
                alt={room.name}
                className="w-16 h-16 rounded-xl object-cover"
              />
              <div>
                <h4 className="font-bold text-sm text-slate-900">{room.name}</h4>
                <p className="text-xs text-slate-600 mt-0.5">${room.price} / night</p>
              </div>
            </div>

            {/* Price Calculations */}
            <div className="space-y-3 text-xs border-y border-slate-200 py-4">
              <div className="flex justify-between text-slate-600">
                <span>Check-In</span>
                <span className="font-bold text-slate-900">{checkIn || '—'}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Check-Out</span>
                <span className="font-bold text-slate-900">{checkOut || '—'}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Duration</span>
                <span className="font-bold text-slate-900">{nights} Nights</span>
              </div>
              <div className="flex justify-between text-slate-600 pt-2 border-t border-slate-100">
                <span>Rate (${room.price} x {nights} nights)</span>
                <span className="font-bold text-slate-900">${totalPrice}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Resort Fees & Taxes</span>
                <span className="font-semibold text-emerald-600">Included ($0)</span>
              </div>
            </div>

            {/* Total */}
            <div className="flex items-center justify-between">
              <span className="text-sm font-extrabold text-slate-900">Total Price</span>
              <span className="text-2xl font-black text-slate-900">${totalPrice}</span>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting || nights <= 0}
              className="w-full py-4 bg-slate-900 hover:bg-sky-950 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {submitting ? (
                <span>Confirming Booking...</span>
              ) : (
                <>
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Confirm Reservation</span>
                </>
              )}
            </button>

            <div className="flex items-center justify-center gap-2 text-[11px] text-slate-500 text-center">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Instant confirmation • Cancel anytime</span>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
