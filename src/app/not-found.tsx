import Link from 'next/link';
import { Waves, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <main className="max-w-7xl mx-auto px-4 py-20 text-center space-y-6">
      <div className="p-4 bg-teal-500/10 border border-teal-500/20 rounded-2xl w-fit mx-auto text-teal-400">
        <Waves className="w-10 h-10" />
      </div>
      <h1 className="text-4xl font-extrabold text-white">404 — Page or Suite Not Found</h1>
      <p className="text-sm text-slate-400 max-w-md mx-auto">
        The suite or page you are searching for does not exist or has been removed.
      </p>
      <Link
        href="/rooms"
        className="inline-flex items-center gap-2 px-6 py-3 bg-teal-500 text-slate-950 font-bold text-xs rounded-xl shadow-lg hover:brightness-110 transition-all"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Explore Rooms
      </Link>
    </main>
  );
}
