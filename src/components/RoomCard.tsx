import Link from 'next/link';
import { Room } from '@/types';
import { Users, Maximize, Star, ArrowRight, MapPin, Building2 } from 'lucide-react';

interface RoomCardProps {
  room: Room;
}

export function RoomCard({ room }: RoomCardProps) {
  return (
    <div className="group bg-white border border-slate-200/90 rounded-3xl overflow-hidden shadow-xs hover:shadow-xl hover:border-slate-300 transition-all duration-300 flex flex-col">
      {/* Image Container */}
      <div className="relative h-64 overflow-hidden bg-slate-100">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={room.images[0]}
          alt={room.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />

        {/* Hotel / Location Badge */}
        {room.hotel && (
          <div className="absolute top-4 left-4 flex flex-col gap-1">
            <span className="px-3 py-1 bg-slate-900/90 backdrop-blur-md text-amber-400 text-[10px] font-extrabold rounded-full uppercase tracking-wider shadow-md flex items-center gap-1.5 border border-white/10">
              <MapPin className="w-3 h-3 text-amber-400" />
              {room.hotel.location}
            </span>
          </div>
        )}

        {/* Price Tag */}
        <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between text-white">
          <div>
            <span className="text-2xl font-black">${room.price}</span>
            <span className="text-xs text-slate-200 font-medium"> / night</span>
          </div>
          {room.rating && (
            <div className="flex items-center gap-1 px-2.5 py-1 bg-white/90 backdrop-blur-md rounded-xl text-amber-600 text-xs font-bold shadow-xs">
              <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
              <span>{room.rating}</span>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
        <div>
          {room.hotel && (
            <p className="text-[11px] font-bold text-sky-800 uppercase tracking-widest flex items-center gap-1 mb-1">
              <Building2 className="w-3 h-3" />
              {room.hotel.name}
            </p>
          )}
          <h3 className="text-lg font-bold text-slate-900 group-hover:text-sky-950 transition-colors">
            {room.name}
          </h3>
          <p className="text-xs text-slate-500 line-clamp-2 mt-2 leading-relaxed">
            {room.description}
          </p>
        </div>

        {/* Specs */}
        <div className="flex items-center gap-4 text-xs font-semibold text-slate-700 py-3 border-y border-slate-100">
          <div className="flex items-center gap-1.5">
            <Users className="w-4 h-4 text-sky-800" />
            <span>Up to {room.capacity} Guests</span>
          </div>
          {room.sizeSqFt && (
            <div className="flex items-center gap-1.5">
              <Maximize className="w-4 h-4 text-sky-800" />
              <span>{room.sizeSqFt} sq ft</span>
            </div>
          )}
        </div>

        {/* Amenities Preview */}
        <div className="flex flex-wrap gap-1.5">
          {room.amenities.slice(0, 3).map((amenity) => (
            <span
              key={amenity}
              className="px-2.5 py-1 bg-slate-100 text-slate-600 rounded-lg text-[11px] font-medium"
            >
              {amenity}
            </span>
          ))}
          {room.amenities.length > 3 && (
            <span className="px-2.5 py-1 bg-slate-50 text-slate-400 rounded-lg text-[11px] font-medium">
              +{room.amenities.length - 3} more
            </span>
          )}
        </div>

        {/* Button */}
        <Link
          href={`/rooms/${room.id}`}
          className="w-full py-3 bg-slate-900 hover:bg-sky-950 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all duration-300 flex items-center justify-center gap-2 group/btn shadow-xs"
        >
          <span>Explore Suite</span>
          <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
}
