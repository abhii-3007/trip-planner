import { Link } from 'react-router-dom';
import { GraduationCap, Twitter, Mail, Phone } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-primary text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 bg-accent rounded-lg flex items-center justify-center">
                <GraduationCap size={20} className="text-primary" />
              </div>
              <span className="font-heading font-bold text-xl">
                Trip<span className="text-accent">Edu</span>
              </span>
            </div>
            <p className="text-white/60 text-sm leading-relaxed max-w-xs">
              Simplifying academic travel for colleges. Plan trips, register students, and manage logistics — all in one place.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-heading font-semibold text-sm uppercase tracking-wider text-white/40 mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2.5">
              {[
                { label: 'Home', to: '/' },
                { label: 'Browse Trips', to: '/trips' },
                { label: 'Admin Login', to: '/login' },
              ].map((l) => (
                <li key={l.to}>
                  <Link
                    to={l.to}
                    className="text-white/70 hover:text-accent text-sm transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-heading font-semibold text-sm uppercase tracking-wider text-white/40 mb-4">
              Contact
            </h3>
            <ul className="space-y-2.5">
              <li className="flex items-center gap-2 text-white/70 text-sm">
                <Mail size={15} className="text-accent flex-shrink-0" />
                admin@greenfield.edu
              </li>
              <li className="flex items-center gap-2 text-white/70 text-sm">
                <Phone size={15} className="text-accent flex-shrink-0" />
                +91 98765 43210
              </li>
              <li className="flex items-center gap-2 text-white/70 text-sm">
                <Twitter size={15} className="text-accent flex-shrink-0" />
                @greenfielduniv
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-white/40 text-xs">
            © {new Date().getFullYear()} TripEdu · Greenfield University. All rights reserved.
          </p>
          <p className="text-white/40 text-xs">
            Built for students, by educators.
          </p>
        </div>
      </div>
    </footer>
  );
}
