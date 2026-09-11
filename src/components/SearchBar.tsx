'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar, Users, Search, MapPin } from 'lucide-react';

export function SearchBar() {
  const router = useRouter();
  const [location, setLocation] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(2);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (location) params.set('location', location);
    if (checkIn) params.set('checkIn', checkIn);
    if (checkOut) params.set('checkOut', checkOut);
    if (guests) params.set('guests', guests.toString());
    router.push(`/rooms?${params.toString()}`);
  };

  return (
    <form
      onSubmit={handleSearch}
      className="w-full bg-white border border-slate-200/80 p-4 sm:p-6 rounded-3xl shadow-xl space-y-4 sm:space-y-0 sm:flex sm:items-center sm:gap-4"
    >
      <div className="flex-1 grid grid-cols-1 sm:grid-cols-4 gap-4">
        {/* Location / Destination */}
        <div className="space-y-1.5 text-left">
          <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-amber-500" /> Indian Destination
          </label>
          <select
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10"
          >
            <option value="">All India Destinations</option>
            <option value="Goa">Goa (Candolim & Majorda)</option>
            <option value="Udaipur">Udaipur, Rajasthan</option>
            <option value="Kerala">Kumarakom, Kerala</option>
            <option value="Jaipur">Jaipur, Rajasthan</option>
            <option value="Shimla">Shimla, Himachal Pradesh</option>
            <option value="Mumbai">Mumbai, Maharashtra</option>
            <option value="Andaman">Havelock Island, Andaman</option>
          </select>
        </div>

        {/* Check-In */}
        <div className="space-y-1.5 text-left">
          <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-sky-800" /> Check-In
          </label>
          <input
            type="date"
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-800/30 font-bold"
          />
        </div>

        {/* Check-Out */}
        <div className="space-y-1.5 text-left">
          <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-sky-800" /> Check-Out
          </label>
          <input
            type="date"
            value={checkOut}
            min={checkIn}
            onChange={(e) => setCheckOut(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-800/30 font-bold"
          />
        </div>

        {/* Guests */}
        <div className="space-y-1.5 text-left">
          <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-sky-800" /> Guests
          </label>
          <select
            value={guests}
            onChange={(e) => setGuests(Number(e.target.value))}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-800/30"
          >
            {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
              <option key={num} value={num}>
                {num} {num === 1 ? 'Guest' : 'Guests'}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="w-full sm:w-auto self-end px-7 py-3.5 bg-slate-900 hover:bg-sky-950 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
      >
        <Search className="w-4 h-4 stroke-[2.5]" />
        Find Indian Stays
      </button>
    </form>
  );
}
