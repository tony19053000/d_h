import Link from 'next/link';
import { listRooms, listHotels } from '@/lib/rooms';
import { SearchBar } from '@/components/SearchBar';
import { RoomCard } from '@/components/RoomCard';
import { ArrowRight, ShieldCheck, HeartHandshake, Award, Building2, MapPin, Star, Sparkles } from 'lucide-react';

export default async function HomePage() {
  const allRooms = await listRooms();
  const allHotels = await listHotels();
  const featuredRooms = allRooms.filter((r) => r.featured);

  return (
    <main className="min-h-screen space-y-20 pb-20 bg-white">
      {/* Hero Section */}
      <section className="relative pt-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
        <div className="relative h-[500px] sm:h-[540px] rounded-3xl overflow-hidden shadow-2xl bg-slate-900 flex items-center justify-center text-center p-6 sm:p-12">
          {/* Hero Photography Background */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://picsum.photos/id/1039/1920/1080"
            alt="LuxeHaven Luxury Indian Resorts Platform"
            className="absolute inset-0 w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/50 to-slate-950/20" />

          {/* Hero Content */}
          <div className="relative z-10 space-y-5 max-w-4xl mx-auto text-white">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-bold uppercase tracking-widest border border-white/30">
              <Award className="w-3.5 h-3.5 text-amber-400" /> Premier Indian Luxury Hotels & Resorts
            </div>
            <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-tight">
              Reserve Heritage Palaces & Beach Resorts Across India
            </h1>
            <p className="text-base sm:text-lg text-slate-200 leading-relaxed font-medium max-w-2xl mx-auto">
              Discover oceanfront beach villas in Goa, floating marble lake palaces in Udaipur, backwater sanctuaries in Kerala, and mountain chalets in Shimla.
            </p>
          </div>
        </div>

        {/* Search Bar Overlay */}
        <div className="-mt-16 sm:-mt-20 relative z-20 max-w-5xl mx-auto">
          <SearchBar />
        </div>
      </section>

      {/* Featured Indian Resorts & Destinations Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 pb-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-sky-800">Top Indian Destinations</span>
            <h2 className="text-3xl font-extrabold text-slate-900 mt-1">Featured Indian Luxury Resorts & Hotels</h2>
          </div>
          <Link
            href="/rooms"
            className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-slate-900 hover:text-sky-950 transition-colors"
          >
            <span>Browse All Hotels</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Hotel Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {allHotels.slice(0, 4).map((hotel) => (
            <div
              key={hotel.id}
              className="group bg-slate-900 rounded-3xl overflow-hidden relative h-80 flex flex-col justify-between p-6 text-white shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-800"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={hotel.image}
                alt={hotel.name}
                className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

              <div className="relative z-10 flex items-center justify-between">
                <span className="px-3 py-1 bg-white/20 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-widest rounded-full border border-white/20">
                  {hotel.type}
                </span>
                <div className="flex items-center gap-1 bg-amber-400 text-slate-950 px-2 py-0.5 rounded-lg text-xs font-extrabold">
                  <Star className="w-3 h-3 fill-slate-950" />
                  <span>{hotel.rating}</span>
                </div>
              </div>

              <div className="relative z-10 space-y-2">
                <div className="flex items-center gap-1.5 text-xs text-amber-300 font-bold uppercase tracking-wider">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{hotel.location}</span>
                </div>
                <h3 className="text-lg font-extrabold leading-snug group-hover:text-amber-300 transition-colors">
                  {hotel.name}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Suites Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 pb-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-sky-800">Handpicked Indian Stays</span>
            <h2 className="text-3xl font-extrabold text-slate-900 mt-1">Signature Beach Villas & Royal Suites</h2>
          </div>
          <Link
            href="/rooms"
            className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-slate-900 hover:text-sky-950 transition-colors"
          >
            <span>View All Accommodations</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredRooms.map((room) => (
            <RoomCard key={room.id} room={room} />
          ))}
        </div>
      </section>

      {/* Platform Value Proposition */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-50 border border-slate-200/80 rounded-3xl p-8 sm:p-14 grid grid-cols-1 md:grid-cols-3 gap-10 text-center sm:text-left">
          <div className="space-y-3">
            <div className="p-3 bg-white border border-slate-200 rounded-2xl w-fit mx-auto sm:mx-0 text-slate-900 shadow-xs">
              <Building2 className="w-6 h-6 stroke-[2]" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Curated Indian Portfolio</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Strictly vetted beach resorts in Goa, floating palaces in Rajasthan, and backwater sanctuaries across India.
            </p>
          </div>

          <div className="space-y-3">
            <div className="p-3 bg-white border border-slate-200 rounded-2xl w-fit mx-auto sm:mx-0 text-slate-900 shadow-xs">
              <ShieldCheck className="w-6 h-6 stroke-[2]" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Instant Guaranteed Availability</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Real-time database room inventory with guaranteed instant booking confirmation and guest privacy.
            </p>
          </div>

          <div className="space-y-3">
            <div className="p-3 bg-white border border-slate-200 rounded-2xl w-fit mx-auto sm:mx-0 text-slate-900 shadow-xs">
              <HeartHandshake className="w-6 h-6 stroke-[2]" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">24/7 Royal Concierge</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Dedicated butler service, private houseboat charters, sunset dinners, and curated cultural excursions.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
