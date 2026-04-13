import { useEffect, useState } from 'react';
import { Search, Filter, X, MapPin } from 'lucide-react';
import api from '../lib/axios';
import { Trip } from '../lib/types';
import TripCard from '../components/TripCard';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const STATUS_OPTIONS: { label: string; value: string }[] = [
  { label: 'All Trips', value: '' },
  { label: 'Upcoming', value: 'upcoming' },
  { label: 'Ongoing', value: 'ongoing' },
  { label: 'Completed', value: 'completed' },
];

export default function Trips() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');

  useEffect(() => {
    setLoading(true);
    const params = statusFilter ? `?status=${statusFilter}` : '';
    api
      .get(`/trips${params}`)
      .then((res) => setTrips(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [statusFilter]);

  const filtered = trips.filter(
    (t) =>
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.destination.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Page Header */}
      <div className="bg-primary text-white py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="font-heading font-bold text-3xl md:text-4xl mb-2">Browse Trips</h1>
          <p className="text-white/70">Find and register for upcoming academic trips from your college.</p>
        </div>
      </div>

      <main className="flex-1 section bg-gray-50 pt-8">
        <div className="container-md">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            {/* Search */}
            <div className="relative flex-1">
              <Search size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                id="trips-search-input"
                type="text"
                placeholder="Search by title or destination..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="form-input pl-10"
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            {/* Status filter */}
            <div className="flex items-center gap-2 flex-wrap">
              <Filter size={16} className="text-gray-400 flex-shrink-0" />
              {STATUS_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  id={`filter-${opt.value || 'all'}`}
                  onClick={() => setStatusFilter(opt.value)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    statusFilter === opt.value
                      ? 'bg-primary text-white'
                      : 'bg-white text-gray-600 border border-gray-200 hover:border-primary hover:text-primary'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Results */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-80 bg-white rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : filtered.length > 0 ? (
            <>
              <p className="text-gray-500 text-sm mb-4">
                {filtered.length} trip{filtered.length !== 1 ? 's' : ''} found
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map((trip) => (
                  <TripCard key={trip.id} trip={trip} />
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-20 text-gray-400">
              <MapPin size={48} className="mx-auto mb-4 opacity-30" />
              <h3 className="font-heading text-lg font-bold text-gray-500 mb-1">No trips found</h3>
              <p className="text-sm">Try adjusting your search or filter criteria.</p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
