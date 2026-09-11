'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Room, Availability } from '@/types';
import { nightsBetween } from '@/lib/availability';
import {
  Users,
  Maximize,
  Bed,
  CheckCircle2,
  Calendar,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  Star,
  ChevronLeft,
  Award,
} from 'lucide-react';

interface RoomDetailClientProps {
  room: Room;
}

export function RoomDetailClient({ room }: RoomDetailClientProps) {
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState(room.images[0]);
  const [checkIn, setCheckIn] = useState('2026-09-20');
  const [checkOut, setCheckOut] = useState('2026-09-24');
  const [guests, setGuests] = useState(2);

  const [availability, setAvailability] = useState<Availability | null>(null);
  const [checking, setChecking] = useState(false);

  const nights = nightsBetween(checkIn, checkOut);
  const totalPrice = nights * room.price;

  useEffect(() => {
    if (!checkIn || !checkOut || nights <= 0) {
      setAvailability(null);
      return;
    }

    let isMounted = true;
    setChecking(true);

    fetch(`/api/rooms/${room.id}/availability?checkIn=${checkIn}&checkOut=${checkOut}`)
      .then((res) => res.json())
      .then((data: Availability) => {
        if (isMounted) {
          setAvailability(data);
          setChecking(false);
        }
      })
      .catch(() => {
        if (isMounted) setChecking(false);
      });

    return () => {
      isMounted = false;
    };
  }, [room.id, checkIn, checkOut, nights]);

  const handleBookNow = () => {
    router.push(
      `/book/${room.id}?checkIn=${encodeURIComponent(checkIn)}&checkOut=${encodeURIComponent(checkOut)}&guests=${guests}`
    );
  };

  return (
    <div className="space-y-10 bg-white">
      {/* Back button & Breadcrumb */}
      <div className="flex items-center justify-between">
        <Link
          href="/rooms"
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to All Accommodations</span>
        </Link>
        <span className="text-xs font-mono text-slate-400">Suite ID: {room.id}</span>
      </div>

      {/* Grid: Photo Gallery & Primary Info */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Gallery & Details (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Main Display Image */}
          <div className="relative h-[420px] rounded-3xl overflow-hidden bg-slate-100 border border-slate-200 shadow-md">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={selectedImage}
              alt={room.name}
              className="w-full h-full object-cover transition-all duration-300"
            />
            <div className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1.5 bg-white/90 backdrop-blur-md rounded-xl text-amber-600 text-xs font-bold shadow-sm">
              <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
              <span>{room.rating || 4.9} / 5.0 Rating</span>
            </div>
          </div>

          {/* Thumbnails */}
          {room.images.length > 1 && (
            <div className="flex items-center gap-4">
              {room.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`relative w-24 h-20 rounded-2xl overflow-hidden border-2 transition-all ${
                    selectedImage === img
                      ? 'border-slate-900 ring-2 ring-slate-900/20 scale-105'
                      : 'border-slate-200 hover:border-slate-400 opacity-80 hover:opacity-100'
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Room Title & Specs */}
          <div className="space-y-4 pt-4 border-t border-slate-200">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-extrabold text-slate-900">{room.name}</h1>
                <p className="text-xs font-bold uppercase tracking-wider text-sky-800 mt-1">
                  Seaside Luxury Suite • Ocean View Sanctuary
                </p>
              </div>
              <div className="text-right">
                <span className="text-3xl font-black text-slate-900">${room.price}</span>
                <span className="text-xs text-slate-500 font-medium"> / night</span>
              </div>
            </div>

            {/* Spec Badges */}
            <div className="grid grid-cols-3 gap-4 p-4 bg-slate-50 border border-slate-200/80 rounded-2xl text-center text-xs">
              <div className="space-y-1">
                <Users className="w-5 h-5 text-slate-800 mx-auto" />
                <p className="text-slate-500">Capacity</p>
                <p className="font-bold text-slate-900">Up to {room.capacity} Guests</p>
              </div>
              <div className="space-y-1 border-x border-slate-200">
                <Maximize className="w-5 h-5 text-slate-800 mx-auto" />
                <p className="text-slate-500">Room Size</p>
                <p className="font-bold text-slate-900">{room.sizeSqFt || 650} sq ft</p>
              </div>
              <div className="space-y-1">
                <Bed className="w-5 h-5 text-slate-800 mx-auto" />
                <p className="text-slate-500">Bedding</p>
                <p className="font-bold text-slate-900">{room.bedType || 'King Bed'}</p>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <h3 className="text-base font-bold text-slate-900">Suite Overview</h3>
              <p className="text-sm text-slate-600 leading-relaxed">{room.description}</p>
            </div>

            {/* Amenities Grid */}
            <div className="space-y-3 pt-4 border-t border-slate-200">
              <h3 className="text-base font-bold text-slate-900">Included Amenities</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {room.amenities.map((amenity) => (
                  <div
                    key={amenity}
                    className="flex items-center gap-2.5 p-3 bg-slate-50 border border-slate-200/80 rounded-xl text-xs font-semibold text-slate-800"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Booking Widget (5 cols) */}
        <div className="lg:col-span-5">
          <div className="bg-white border border-slate-200 p-6 sm:p-8 rounded-3xl space-y-6 sticky top-28 shadow-xl">
            <div className="border-b border-slate-200 pb-4">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-sky-800" />
                Reserve Suite
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Select check-in and check-out dates to verify availability.
              </p>
            </div>

            {/* Date Picker Form */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Check-In
                  </label>
                  <input
                    type="date"
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-slate-900"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Check-Out
                  </label>
                  <input
                    type="date"
                    value={checkOut}
                    min={checkIn}
                    onChange={(e) => setCheckOut(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-slate-900"
                  />
                </div>
              </div>

              {/* Guests Selection */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Number of Guests
                </label>
                <select
                  value={guests}
                  onChange={(e) => setGuests(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-slate-900"
                >
                  {Array.from({ length: room.capacity }, (_, i) => i + 1).map((num) => (
                    <option key={num} value={num}>
                      {num} {num === 1 ? 'Guest' : 'Guests'} (Max {room.capacity})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Live Availability Status Display */}
            {checking ? (
              <div className="p-4 bg-slate-50 rounded-2xl text-center text-xs text-slate-500 font-medium animate-pulse">
                Verifying date availability...
              </div>
            ) : availability ? (
              availability.available ? (
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl space-y-1">
                  <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs">
                    <Award className="w-4 h-4 text-emerald-600" />
                    <span>Suite Available for Selected Dates!</span>
                  </div>
                  <p className="text-xs text-slate-600">
                    {nights} {nights === 1 ? 'Night' : 'Nights'} ({checkIn} to {checkOut}).
                  </p>
                </div>
              ) : (
                <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl space-y-1">
                  <div className="flex items-center gap-2 text-rose-700 font-bold text-xs">
                    <AlertCircle className="w-4 h-4 text-rose-600" />
                    <span>Dates Unavailable</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {availability.reason || 'The suite is already reserved for the selected period.'}
                  </p>
                </div>
              )
            ) : null}

            {/* Price Breakdown */}
            {nights > 0 && (
              <div className="space-y-2 pt-4 border-t border-slate-200 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>${room.price} x {nights} nights</span>
                  <span className="font-semibold text-slate-900">${totalPrice}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Resort Fees & Taxes</span>
                  <span className="font-semibold text-emerald-600">Included</span>
                </div>
                <div className="flex justify-between text-sm font-extrabold text-slate-900 pt-2 border-t border-slate-200">
                  <span>Total Amount</span>
                  <span className="text-slate-900 text-base">${totalPrice}</span>
                </div>
              </div>
            )}

            {/* Book Button */}
            <button
              onClick={handleBookNow}
              disabled={checking || (availability !== null && !availability.available)}
              className={`w-full py-4 rounded-xl font-extrabold text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2 ${
                availability && !availability.available
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                  : 'bg-slate-900 text-white hover:bg-sky-950 shadow-slate-900/10'
              }`}
            >
              <span>Proceed to Booking</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </button>

            <div className="flex items-center justify-center gap-2 text-[11px] text-slate-500 pt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Instant Confirmation • Flexible Cancellation</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
