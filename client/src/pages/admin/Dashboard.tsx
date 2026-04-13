import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Users, ClipboardList, CheckCircle, ExternalLink } from 'lucide-react';
import { format } from 'date-fns';
import api from '../../lib/axios';
import { Trip, TripRegistration } from '../../lib/types';
import AdminSidebar from '../../components/AdminSidebar';
import StatsCard from '../../components/StatsCard';

export default function Dashboard() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [registrations, setRegistrations] = useState<TripRegistration[]>([]);
  const [studentCount, setStudentCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.get('/trips'), api.get('/registrations'), api.get('/students')])
      .then(([tripsRes, regRes, studentsRes]) => {
        setTrips(tripsRes.data);
        setRegistrations(regRes.data);
        setStudentCount(Array.isArray(studentsRes.data) ? studentsRes.data.length : 0);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const upcomingTrips = trips.filter((t) => t.status === 'upcoming');
  const paidCount = registrations.filter((r) => r.payment_status === 'paid').length;
  const pendingCount = registrations.filter((r) => r.payment_status === 'pending').length;

  const recentRegistrations = registrations.slice(0, 5);

  const PAYMENT_BADGE: Record<string, string> = {
    paid: 'badge-paid',
    pending: 'badge-pending',
    waived: 'badge-waived',
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />

      <main className="flex-1 overflow-auto">
        {/* Header */}
        <div className="bg-white border-b border-gray-100 px-8 py-5">
          <h1 className="font-heading font-bold text-primary text-2xl">Dashboard Overview</h1>
          <p className="text-gray-500 text-sm mt-0.5">
            Welcome back! Here's what's happening with your trips.
          </p>
        </div>

        <div className="px-6 lg:px-8 py-8 space-y-8 max-w-5xl">
          {/* Stats */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-28 bg-white rounded-2xl animate-pulse border border-gray-100" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <StatsCard
                title="Total Trips"
                value={trips.length}
                icon={MapPin}
                color="navy"
                subtitle={`${upcomingTrips.length} upcoming`}
              />
              <StatsCard
                title="Registered Students"
                value={studentCount}
                icon={Users}
                color="blue"
                subtitle="All time"
              />
              <StatsCard
                title="Payments Confirmed"
                value={paidCount}
                icon={CheckCircle}
                color="green"
                subtitle={`${pendingCount} pending`}
              />
              <StatsCard
                title="Total Registrations"
                value={registrations.length}
                icon={ClipboardList}
                color="amber"
                subtitle={`${pendingCount} awaiting payment`}
              />
            </div>
          )}

          {/* Trip Status Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Upcoming Trips Table */}
            <div className="bg-white rounded-2xl shadow-card border border-gray-100 overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                <h2 className="font-heading font-bold text-primary text-base">Upcoming Trips</h2>
                <Link to="/admin/trips" className="text-accent text-sm font-semibold hover:underline flex items-center gap-1">
                  Manage <ExternalLink size={13} />
                </Link>
              </div>
              {upcomingTrips.length === 0 ? (
                <p className="text-gray-400 text-sm text-center py-8">No upcoming trips.</p>
              ) : (
                <div className="divide-y divide-gray-50">
                  {upcomingTrips.slice(0, 5).map((trip) => {
                    const seatsLeft = trip.seats_left ?? (trip.max_capacity - (trip.registered_count ?? 0));
                    return (
                      <div key={trip.id} className="px-5 py-3 flex items-center gap-3">
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-primary text-sm truncate">{trip.title}</p>
                          <p className="text-gray-400 text-xs">{trip.destination}</p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="text-xs text-gray-400">{format(new Date(trip.start_date), 'MMM d')}</p>
                          <p className={`text-xs font-semibold ${seatsLeft <= 5 ? 'text-orange-500' : 'text-emerald-600'}`}>
                            {seatsLeft} seats left
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Recent Registrations */}
            <div className="bg-white rounded-2xl shadow-card border border-gray-100 overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                <h2 className="font-heading font-bold text-primary text-base">Recent Registrations</h2>
                <Link to="/admin/registrations" className="text-accent text-sm font-semibold hover:underline flex items-center gap-1">
                  View All <ExternalLink size={13} />
                </Link>
              </div>
              {recentRegistrations.length === 0 ? (
                <p className="text-gray-400 text-sm text-center py-8">No registrations yet.</p>
              ) : (
                <div className="divide-y divide-gray-50">
                  {recentRegistrations.map((reg) => (
                    <div key={reg.id} className="px-5 py-3 flex items-center gap-3">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-primary text-xs font-bold">
                          {reg.student?.name?.[0] ?? '?'}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-primary text-sm truncate">
                          {reg.student?.name ?? 'Unknown'}
                        </p>
                        <p className="text-gray-400 text-xs truncate">{reg.trip?.title ?? '-'}</p>
                      </div>
                      <span className={PAYMENT_BADGE[reg.payment_status]}>
                        {reg.payment_status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
