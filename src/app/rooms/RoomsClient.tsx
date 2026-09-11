'use client';

import { useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { Room } from '@/types';
import { RoomCard } from '@/components/RoomCard';
import { RotateCcw, SearchX, SlidersHorizontal, Users, DollarSign, CheckSquare, Square, MapPin } from 'lucide-react';

interface RoomsClientProps {
  initialRooms: Room[];
}

const AVAILABLE_AMENITIES = [
  'Arabian Sea View',
  'Private Beach Access',
  'Infinity Pool',
  'Private Plunge Pool',
  'Ayurvedic Spa',
  'Free Wi-Fi',
  'Butler Service',
  'Breakfast Included',
  'Private Garden',
  'Heritage View',
];

export function RoomsClient({ initialRooms }: RoomsClientProps) {
  const searchParams = useSearchParams();

  const initialLocation = searchParams.get('location') || '';
  const initialGuests = Number(searchParams.get('guests')) || 1;
  const initialMaxPrice = Number(searchParams.get('maxPrice')) || 2000;
  const initialAmenitiesParam = searchParams.get('amenities');
  const initialAmenities = initialAmenitiesParam ? initialAmenitiesParam.split(',') : [];

  const [locationFilter, setLocationFilter] = useState<string>(initialLocation);
  const [guests, setGuests] = useState<number>(initialGuests);
  const [maxPrice, setMaxPrice] = useState<number>(initialMaxPrice);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>(initialAmenities);

  const toggleAmenity = (amenity: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenity) ? prev.filter((a) => a !== amenity) : [...prev, amenity]
    );
  };

  const resetFilters = () => {
    setLocationFilter('');
    setGuests(1);
    setMaxPrice(2000);
    setSelectedAmenities([]);
  };

  const filteredRooms = useMemo(() => {
    return initialRooms.filter((room) => {
      if (
        locationFilter &&
        room.hotel &&
        !room.hotel.location.toLowerCase().includes(locationFilter.toLowerCase())
      ) {
        return false;
      }
      if (room.capacity < guests) return false;
      if (room.price > maxPrice) return false;
      if (selectedAmenities.length > 0) {
        const matchesAll = selectedAmenities.every((selected) =>
          room.amenities.some((a) => a.toLowerCase().includes(selected.toLowerCase()))
        );
        if (!matchesAll) return false;
      }
      return true;
    });
  }, [initialRooms, locationFilter, guests, maxPrice, selectedAmenities]);

  return (
    <div className="space-y-8 bg-white">
      {/* Header */}
      <div className="border-b border-slate-200 pb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900">Luxury Indian Hotels & Beach Resorts</h1>
          <p className="text-sm text-slate-500 mt-1">
            Browse and reserve luxury stays across Goa, Udaipur, Kerala, Jaipur, Shimla, Mumbai, and Andaman Islands.
          </p>
        </div>
        <div className="text-xs font-bold text-slate-900 bg-slate-100 border border-slate-200 px-4 py-1.5 rounded-full w-fit">
          Showing {filteredRooms.length} of {initialRooms.length} Available Stays
        </div>
      </div>

      {/* Filter Sidebar & Room Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters Sidebar */}
        <aside className="lg:col-span-1 space-y-6 bg-slate-50 border border-slate-200/80 p-6 rounded-3xl h-fit sticky top-28">
          <div className="flex items-center justify-between border-b border-slate-200 pb-4">
            <div className="flex items-center gap-2 font-bold text-slate-900 text-sm uppercase tracking-wider">
              <SlidersHorizontal className="w-4 h-4 text-sky-800" />
              <span>Filter Search</span>
            </div>
            <button
              onClick={resetFilters}
              className="flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset
            </button>
          </div>

          {/* Destination */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-amber-500" /> Destination (India)
            </label>
            <select
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10"
            >
              <option value="">All Indian Destinations</option>
              <option value="Goa">Goa (Candolim & Majorda)</option>
              <option value="Udaipur">Udaipur, Rajasthan</option>
              <option value="Kerala">Kumarakom, Kerala</option>
              <option value="Jaipur">Jaipur, Rajasthan</option>
              <option value="Shimla">Shimla, Himachal Pradesh</option>
              <option value="Mumbai">Mumbai, Maharashtra</option>
              <option value="Andaman">Havelock Island, Andaman</option>
            </select>
          </div>

          {/* Guest Count */}
          <div className="space-y-2 pt-3 border-t border-slate-200">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <Users className="w-4 h-4 text-sky-800" /> Minimum Guests
            </label>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min={1}
                max={8}
                value={guests}
                onChange={(e) => setGuests(Number(e.target.value))}
                className="w-full accent-slate-900 h-2 bg-slate-200 rounded-lg cursor-pointer"
              />
              <span className="font-extrabold text-sm text-slate-900 w-8 text-right">{guests}+</span>
            </div>
          </div>

          {/* Max Price */}
          <div className="space-y-2 pt-3 border-t border-slate-200">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <DollarSign className="w-4 h-4 text-sky-800" /> Max Price / Night
              </label>
              <span className="font-extrabold text-sm text-slate-900">${maxPrice}</span>
            </div>
            <input
              type="range"
              min={200}
              max={2000}
              step={50}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-slate-900 h-2 bg-slate-200 rounded-lg cursor-pointer"
            />
          </div>

          {/* Amenities */}
          <div className="space-y-2.5 pt-4 border-t border-slate-200">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-2">
              Desired Amenities
            </label>
            <div className="space-y-2">
              {AVAILABLE_AMENITIES.map((amenity) => {
                const isSelected = selectedAmenities.includes(amenity);
                return (
                  <button
                    key={amenity}
                    type="button"
                    onClick={() => toggleAmenity(amenity)}
                    className="w-full flex items-center gap-2.5 text-xs text-left font-medium transition-colors hover:text-slate-900"
                  >
                    {isSelected ? (
                      <CheckSquare className="w-4 h-4 text-slate-900 flex-shrink-0" />
                    ) : (
                      <Square className="w-4 h-4 text-slate-400 flex-shrink-0" />
                    )}
                    <span className={isSelected ? 'text-slate-900 font-bold' : 'text-slate-600'}>
                      {amenity}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </aside>

        {/* Room Grid / Empty State */}
        <main className="lg:col-span-3">
          {filteredRooms.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredRooms.map((room) => (
                <RoomCard key={room.id} room={room} />
              ))}
            </div>
          ) : (
            <div className="bg-slate-50 border border-slate-200 border-dashed rounded-3xl p-12 text-center space-y-4">
              <div className="p-4 bg-white border border-slate-200 rounded-2xl w-fit mx-auto text-slate-400">
                <SearchX className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">No Stays Match Selected Filters</h3>
              <p className="text-sm text-slate-500 max-w-md mx-auto">
                Try resetting destination, capacity, or price filters to explore available luxury stays across India.
              </p>
              <button
                onClick={resetFilters}
                className="px-6 py-2.5 bg-slate-900 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-sm hover:bg-slate-800 transition-all inline-flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" /> Reset Filters
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
