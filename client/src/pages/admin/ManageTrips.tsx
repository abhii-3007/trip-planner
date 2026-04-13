import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, AlertCircle, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import api from '../../lib/axios';
import { Trip } from '../../lib/types';
import AdminSidebar from '../../components/AdminSidebar';
import TripFormModal from '../../components/TripFormModal';

const STATUS_BADGE: Record<string, string> = {
  upcoming:  'badge-upcoming',
  ongoing:   'badge-ongoing',
  completed: 'badge-completed',
  cancelled: 'badge-cancelled',
};

export default function ManageTrips() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editTrip, setEditTrip] = useState<Trip | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const fetchTrips = () => {
    setLoading(true);
    api
      .get('/trips')
      .then((r) => setTrips(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchTrips(); }, []);

  const openCreate = () => { setEditTrip(null); setModalOpen(true); };
  const openEdit = (trip: Trip) => { setEditTrip(trip); setModalOpen(true); };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Delete this trip and all its registrations? This cannot be undone.')) return;
    setDeletingId(id);
    try {
      await api.delete(`/trips/${id}`);
      setTrips((prev) => prev.filter((t) => t.id !== id));
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to delete trip');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />

      <main className="flex-1 overflow-auto">
        {/* Header */}
        <div className="bg-white border-b border-gray-100 px-8 py-5 flex items-center justify-between">
          <div>
            <h1 className="font-heading font-bold text-primary text-2xl">Manage Trips</h1>
            <p className="text-gray-500 text-sm mt-0.5">Create, edit, and delete academic trips.</p>
          </div>
          <button
            onClick={openCreate}
            id="create-trip-btn"
            className="btn-accent py-2.5 px-5"
          >
            <Plus size={17} />
            New Trip
          </button>
        </div>

        <div className="px-6 lg:px-8 py-8">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 size={32} className="animate-spin text-primary opacity-40" />
            </div>
          ) : trips.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              <AlertCircle size={40} className="mx-auto mb-3 opacity-30" />
              <p>No trips yet. Create your first trip!</p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-card border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Title</th>
                      <th>Destination</th>
                      <th>Dates</th>
                      <th>Capacity</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {trips.map((trip) => {
                      const seatsLeft = trip.seats_left ?? (trip.max_capacity - (trip.registered_count ?? 0));
                      return (
                        <tr key={trip.id}>
                          <td className="text-gray-400 text-xs">{trip.id}</td>
                          <td>
                            <p className="font-semibold text-primary text-sm">{trip.title}</p>
                            <p className="text-gray-400 text-xs">{trip.organizer?.name}</p>
                          </td>
                          <td>{trip.destination}</td>
                          <td className="text-xs whitespace-nowrap">
                            {format(new Date(trip.start_date), 'MMM d')} –{' '}
                            {format(new Date(trip.end_date), 'MMM d, yyyy')}
                          </td>
                          <td>
                            <div className="text-xs">
                              <span className="font-semibold">{trip.registered_count ?? 0}</span>
                              <span className="text-gray-400"> / {trip.max_capacity}</span>
                            </div>
                            <p className={`text-xs ${seatsLeft <= 5 ? 'text-orange-500' : 'text-emerald-600'}`}>
                              {seatsLeft} left
                            </p>
                          </td>
                          <td>
                            <span className={`${STATUS_BADGE[trip.status]} capitalize`}>
                              {trip.status}
                            </span>
                          </td>
                          <td>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => openEdit(trip)}
                                id={`edit-trip-${trip.id}`}
                                className="p-1.5 text-gray-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-colors"
                                title="Edit"
                              >
                                <Pencil size={15} />
                              </button>
                              <button
                                onClick={() => handleDelete(trip.id)}
                                id={`delete-trip-${trip.id}`}
                                disabled={deletingId === trip.id}
                                className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                                title="Delete"
                              >
                                {deletingId === trip.id ? (
                                  <Loader2 size={15} className="animate-spin" />
                                ) : (
                                  <Trash2 size={15} />
                                )}
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>

      {modalOpen && (
        <TripFormModal
          trip={editTrip}
          onClose={() => { setModalOpen(false); setEditTrip(null); }}
          onSaved={fetchTrips}
        />
      )}
    </div>
  );
}
