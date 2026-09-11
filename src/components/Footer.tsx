import Link from 'next/link';
import { Building2, MapPin, Phone, Mail, Award, Globe } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400 text-sm mt-24 border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid grid-cols-1 md:grid-cols-4 gap-10">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-400 text-slate-950 rounded-lg">
              <Building2 className="w-5 h-5 stroke-[2.5]" />
            </div>
            <span className="font-extrabold text-lg text-white tracking-tight">LUXEHAVEN</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            The premier luxury booking platform for heritage palaces, beachfront resorts, backwater sanctuaries, and mountain chalets across India.
          </p>
        </div>

        <div>
          <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-4">Indian Destinations</h4>
          <ul className="space-y-2.5 text-xs">
            <li><Link href="/rooms?location=Goa" className="hover:text-white transition-colors">Candolim & Majorda, Goa</Link></li>
            <li><Link href="/rooms?location=Udaipur" className="hover:text-white transition-colors">Lake Pichola, Udaipur</Link></li>
            <li><Link href="/rooms?location=Kerala" className="hover:text-white transition-colors">Kumarakom, Kerala</Link></li>
            <li><Link href="/rooms?location=Jaipur" className="hover:text-white transition-colors">Pink City, Jaipur</Link></li>
            <li><Link href="/rooms?location=Shimla" className="hover:text-white transition-colors">Wildflower, Shimla</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-4">Platform Experience</h4>
          <ul className="space-y-2.5 text-xs text-slate-400">
            <li>Instant Verified Bookings</li>
            <li>24/7 Royal Butler Access</li>
            <li>Best Price & Luxury Guarantee</li>
            <li>Flexible Guest Cancellation</li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-4">India Concierge</h4>
          <ul className="space-y-3 text-xs text-slate-400">
            <li className="flex items-center gap-2.5">
              <Globe className="w-4 h-4 text-amber-400 flex-shrink-0" />
              <span>India Luxury Reservations</span>
            </li>
            <li className="flex items-center gap-2.5">
              <Phone className="w-4 h-4 text-amber-400 flex-shrink-0" />
              <span>+91 (1800) LUXE-INDIA</span>
            </li>
            <li className="flex items-center gap-2.5">
              <Mail className="w-4 h-4 text-amber-400 flex-shrink-0" />
              <span>concierge@luxehaven.in</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-slate-900 py-6 text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between max-w-7xl mx-auto px-4">
        <p>© 2026 LuxeHaven Hotels & Resorts Platform. All rights reserved.</p>
        <div className="flex items-center gap-2 mt-2 sm:mt-0 text-slate-400">
          <Award className="w-4 h-4 text-amber-400" />
          <span>India Hospitality Award Winner</span>
        </div>
      </div>
    </footer>
  );
}
