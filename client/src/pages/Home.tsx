import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, GraduationCap, MapPin, Shield, Star } from 'lucide-react';
import api from '../lib/axios';
import { Trip } from '../lib/types';
import TripCard from '../components/TripCard';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Home() {
  const [featuredTrips, setFeaturedTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/trips?status=upcoming')
      .then((res) => setFeaturedTrips(res.data.slice(0, 3)))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* ── Hero ──────────────────────────────────────────────────── */}
      <section className="relative bg-primary text-white overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-white/5 rounded-full" />
          <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-accent/10 rounded-full" />
        </div>

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-20 md:py-28">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 bg-accent/20 text-accent text-sm font-semibold px-4 py-1.5 rounded-full mb-6">
              <GraduationCap size={16} />
              Academic Trip Management Platform
            </span>

            <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl font-bold leading-tight mb-6">
              Plan Your Perfect{' '}
              <span className="text-accent">College Trip</span>
            </h1>

            <p className="text-white/75 text-lg leading-relaxed mb-10 max-w-xl">
              Organize academic tours, register students, manage registrations, and track payments — all in one seamless platform built for colleges.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/trips" id="hero-explore-btn" className="btn-accent text-base px-8 py-3.5">
                Explore Trips
                <ArrowRight size={18} />
              </Link>
              <Link to="/login" id="hero-admin-btn" className="inline-flex items-center gap-2 border-2 border-white/30 text-white font-semibold px-8 py-3.5 rounded-xl hover:bg-white/10 transition-all duration-200 text-base">
                Admin Portal
              </Link>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-8 mt-14">
              {[
                { label: 'Trips Organized', value: '50+' },
                { label: 'Students Registered', value: '2,400+' },
                { label: 'Destinations', value: '30+' },
              ].map((s) => (
                <div key={s.label}>
                  <p className="font-heading font-bold text-2xl text-accent">{s.value}</p>
                  <p className="text-white/60 text-sm">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Features ──────────────────────────────────────────────── */}
      <section className="section bg-gray-50">
        <div className="container-md">
          <div className="text-center mb-12">
            <h2 className="font-heading font-bold text-primary text-3xl md:text-4xl mb-3">
              Everything You Need to Run a Great Trip
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              From planning to payments, TripEdu handles every step of the academic trip lifecycle.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: MapPin,
                color: 'bg-blue-100 text-blue-600',
                title: 'Trip Discovery',
                desc: 'Browse all upcoming academic trips with rich details, seat availability, and instant registration.',
              },
              {
                icon: GraduationCap,
                color: 'bg-amber-100 text-amber-600',
                title: 'Student Registration',
                desc: 'Streamlined student onboarding with emergency contact info and medical notes collection.',
              },
              {
                icon: Shield,
                color: 'bg-emerald-100 text-emerald-600',
                title: 'Admin Control',
                desc: 'Manage trips, track payment statuses, and export student data — all from a secure dashboard.',
              },
            ].map((f) => (
              <div key={f.title} className="card p-6 animate-slide-up">
                <div className={`w-12 h-12 rounded-xl ${f.color} flex items-center justify-center mb-4`}>
                  <f.icon size={22} />
                </div>
                <h3 className="font-heading font-bold text-primary text-lg mb-2">{f.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Trips ─────────────────────────────────────────── */}
      <section className="section">
        <div className="container-md">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="font-heading font-bold text-primary text-3xl mb-2">
                Upcoming Trips
              </h2>
              <p className="text-gray-500">Discover exciting academic journeys happening soon.</p>
            </div>
            <Link to="/trips" className="btn-outline py-2 px-5 text-sm whitespace-nowrap">
              View All →
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-80 bg-gray-100 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : featuredTrips.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredTrips.map((trip) => (
                <TripCard key={trip.id} trip={trip} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-400">
              <MapPin size={40} className="mx-auto mb-3 opacity-30" />
              <p>No upcoming trips at the moment.</p>
            </div>
          )}
        </div>
      </section>

      {/* ── CTA Banner ────────────────────────────────────────────── */}
      <section className="section bg-primary">
        <div className="container-md text-center">
          <Star size={36} className="text-accent mx-auto mb-4" />
          <h2 className="font-heading font-bold text-white text-3xl md:text-4xl mb-4">
            Ready to Start Your Academic Journey?
          </h2>
          <p className="text-white/70 mb-8 max-w-md mx-auto">
            Join hundreds of students from Greenfield University who've explored India's most remarkable destinations.
          </p>
          <Link to="/trips" id="cta-register-btn" className="btn-accent text-base px-10 py-3.5">
            Browse All Trips <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
