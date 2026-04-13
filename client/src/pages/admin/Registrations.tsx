import { useEffect, useState } from 'react';
import { Loader2, ChevronDown } from 'lucide-react';
import { format } from 'date-fns';
import api from '../../lib/axios';
import { Trip, TripRegistration } from '../../lib/types';
import AdminSidebar from '../../components/AdminSidebar';

const PAYMENT_BADGE: Record<string, string> = {
  paid:    'badge-paid',
  pending: 'badge-pending',
  waived:  'badge-waived',
};

export default function Registrations() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [selectedTripId, setSelectedTripId] = useState<string>('');
  const [registrations, setRegistrations] = useState<TripRegistration[]>([]);
  const [loadingTrips, setLoadingTrips] = useState(true);
  const [loadingRegs, setLoadingRegs] = useState(false);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  useEffect(() => {
    api
      .get('/trips')
      .then((r) => setTrips(r.data))
      .catch(console.error)
      .finally(() => setLoadingTrips(false));
  }, []);

  useEffect(() => {
    if (!selectedTripId) { setRegistrations([]); return; }
    setLoadingRegs(true);
    api
      .get(`/registrations?trip_id=${selectedTripId}`)
      .then((r) => setRegistrations(r.data))
      .catch(console.error)
      .finally(() => setLoadingRegs(false));
  }, [selectedTripId]);

  const updatePayment = async (regId: number, status: string) => {
    setUpdatingId(regId);
    try {
      await api.put(`/registrations/${regId}/payment`, { payment_status: status });
      setRegistrations((prev) =>
        prev.map((r) => (r.id === regId ? { ...r, payment_status: status as any } : r))
      );
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to update payment status');
    } finally {
      setUpdatingId(null);
    }
  };

  const selectedTrip = trips.find((t) => String(t.id) === selectedTripId);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />

      <main className="flex-1 overflow-auto">
        {/* Header */}
        <div className="bg-white border-b border-gray-100 px-8 py-5">
          <h1 className="font-heading font-bold text-primary text-2xl">Trip Registrations</h1>
          <p className="text-gray-500 text-sm mt-0.5">
            View all students registered for a trip and manage payment status.
          </p>
        </div>

        <div className="px-6 lg:px-8 py-8 space-y-6">
          {/* Trip Selector */}
          <div className="bg-white rounded-2xl shadow-card border border-gray-100 p-5">
            <label htmlFor="trip-selector" className="form-label">Select a Trip</label>
            {loadingTrips ? (
              <div className="h-10 bg-gray-100 rounded-xl animate-pulse" />
            ) : (
              <div className="relative">
                <select
                  id="trip-selector"
                  value={selectedTripId}
                  onChange={(e) => setSelectedTripId(e.target.value)}
                  className="form-input appearance-none pr-10"
                >
                  <option value="">— Choose a trip —</option>
                  {trips.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.title} — {t.destination} ({format(new Date(t.start_date), 'MMM d, yyyy')})
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={16}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                />
              </div>
            )}

            {/* Trip summary */}
            {selectedTrip && (
              <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-gray-100">
                <Stat label="Registration" value={registrations.length} />
                <Stat label="Capacity" value={selectedTrip.max_capacity} />
                <Stat label="Paid" value={registrations.filter((r) => r.payment_status === 'paid').length} />
                <Stat label="Pending" value={registrations.filter((r) => r.payment_status === 'pending').length} />
              </div>
            )}
          </div>

          {/* Registrations Table */}
          {selectedTripId && (
            <>
              {loadingRegs ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 size={28} className="animate-spin text-primary opacity-40" />
                </div>
              ) : registrations.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  No registrations for this trip yet.
                </div>
              ) : (
                <div className="bg-white rounded-2xl shadow-card border border-gray-100 overflow-hidden">
                  <div className="px-5 py-4 border-b border-gray-100">
                    <h2 className="font-heading font-bold text-primary text-base">
                      {registrations.length} Student{registrations.length !== 1 ? 's' : ''} Registered
                    </h2>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>Student</th>
                          <th>Enrollment</th>
                          <th>Department</th>
                          <th>Phone</th>
                          <th>Emergency Contact</th>
                          <th>Medical Notes</th>
                          <th>Registered</th>
                          <th>Payment</th>
                        </tr>
                      </thead>
                      <tbody>
                        {registrations.map((reg) => (
                          <tr key={reg.id}>
                            <td>
                              <div className="flex items-center gap-2.5">
                                <div className="w-7 h-7 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                                  <span className="text-primary text-xs font-bold">
                                    {reg.student?.name?.[0] ?? '?'}
                                  </span>
                                </div>
                                <div>
                                  <p className="font-semibold text-primary text-sm">{reg.student?.name}</p>
                                  <p className="text-gray-400 text-xs">{reg.student?.email}</p>
                                </div>
                              </div>
                            </td>
                            <td className="font-mono text-xs">{reg.student?.enrollment_no}</td>
                            <td className="text-xs">{reg.student?.department}</td>
                            <td className="text-xs">{reg.student?.phone}</td>
                            <td className="text-xs">{reg.emergency_contact}</td>
                            <td className="text-xs text-gray-400 max-w-xs truncate">
                              {reg.medical_notes || '—'}
                            </td>
                            <td className="text-xs text-gray-400 whitespace-nowrap">
                              {format(new Date(reg.registered_at), 'MMM d, yyyy')}
                            </td>
                            <td>
                              <div className="flex items-center gap-2">
                                <span className={PAYMENT_BADGE[reg.payment_status]}>
                                  {reg.payment_status}
                                </span>
                                {updatingId === reg.id ? (
                                  <Loader2 size={14} className="animate-spin text-primary" />
                                ) : (
                                  <select
                                    id={`payment-status-${reg.id}`}
                                    value={reg.payment_status}
                                    onChange={(e) => updatePayment(reg.id, e.target.value)}
                                    className="text-xs border border-gray-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-primary-300"
                                  >
                                    <option value="paid">Paid</option>
                                    <option value="pending">Pending</option>
                                    <option value="waived">Waived</option>
                                  </select>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <p className="text-xs text-gray-400 mb-0.5">{label}</p>
      <p className="font-heading font-bold text-primary text-xl">{value}</p>
    </div>
  );
}
