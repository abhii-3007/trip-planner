import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  MapPin, Calendar, Users, ArrowLeft, Loader2,
  CheckCircle, AlertCircle, Clock,
} from 'lucide-react';
import { format } from 'date-fns';
import api from '../lib/axios';
import { Trip } from '../lib/types';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

// ── Schemas ────────────────────────────────────────────────────────────────

const studentSchema = z.object({
  name: z.string().min(2, 'Full name is required'),
  email: z.string().email('Invalid email'),
  phone: z.string().regex(/^\d{10}$/, '10-digit phone required'),
  enrollment_no: z.string().min(3, 'Enrollment number required'),
  department: z.string().min(2, 'Department required'),
  year: z.coerce.number().int().min(1).max(6),
  emergency_contact: z.string().regex(/^\d{10}$/, '10-digit emergency contact required'),
  medical_notes: z.string().optional(),
});

type StudentForm = z.infer<typeof studentSchema>;

// ── Component ──────────────────────────────────────────────────────────────

export default function TripDetail() {
  const { id } = useParams<{ id: string }>();
  const [trip, setTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitState, setSubmitState] = useState<'idle' | 'success' | 'error'>('idle');
  const [submitMessage, setSubmitMessage] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<StudentForm>({
    resolver: zodResolver(studentSchema),
    defaultValues: { year: 1 },
  });

  useEffect(() => {
    api
      .get(`/trips/${id}`)
      .then((res) => setTrip(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  const onSubmit = async (data: StudentForm) => {
    setSubmitState('idle');
    setSubmitMessage('');
    try {
      // 1. Create student (college_id=1 → Greenfield University default)
      const studentRes = await api.post('/students', {
        name: data.name,
        email: data.email,
        phone: data.phone,
        enrollment_no: data.enrollment_no,
        department: data.department,
        year: data.year,
        college_id: 1,
      });
      const studentId = studentRes.data.id;

      // 2. Register for trip
      await api.post('/registrations', {
        trip_id: Number(id),
        student_id: studentId,
        emergency_contact: data.emergency_contact,
        medical_notes: data.medical_notes,
      });

      setSubmitState('success');
      setSubmitMessage('Registration successful! You\'re all set for the trip.');
      reset();
      // Refresh trip to update seat count
      api.get(`/trips/${id}`).then((res) => setTrip(res.data));
    } catch (err: any) {
      setSubmitState('error');
      setSubmitMessage(
        err.response?.data?.error || 'Registration failed. Please try again.'
      );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center text-gray-400">
          <div className="text-center">
            <AlertCircle size={48} className="mx-auto mb-3 opacity-30" />
            <p className="font-heading text-lg text-gray-500">Trip not found.</p>
            <Link to="/trips" className="btn-primary mt-4 inline-flex">← Back to Trips</Link>
          </div>
        </div>
      </div>
    );
  }

  const seatsLeft = trip.seats_left ?? (trip.max_capacity - (trip.registered_count ?? 0));
  const isFull = seatsLeft <= 0;
  const isCancelled = trip.status === 'cancelled';
  const canRegister = !isFull && !isCancelled;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero image */}
      <div className="relative h-64 md:h-80 overflow-hidden">
        <img
          src={trip.image_url || 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80'}
          alt={trip.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 px-4 sm:px-6 pb-6 max-w-6xl mx-auto">
          <Link to="/trips" className="inline-flex items-center gap-1.5 text-white/80 hover:text-white text-sm mb-3 transition-colors">
            <ArrowLeft size={16} /> Back to Trips
          </Link>
          <h1 className="font-heading font-bold text-white text-2xl md:text-4xl">{trip.title}</h1>
        </div>
      </div>

      <main className="flex-1 section bg-gray-50 pt-8">
        <div className="container-md">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Trip Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Meta */}
              <div className="card p-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                  <InfoItem icon={MapPin} label="Destination" value={trip.destination} />
                  <InfoItem
                    icon={Calendar}
                    label="Dates"
                    value={`${format(new Date(trip.start_date), 'MMM d')} – ${format(new Date(trip.end_date), 'MMM d, yyyy')}`}
                  />
                  <InfoItem
                    icon={Users}
                    label="Seats"
                    value={
                      isFull
                        ? 'Fully Booked'
                        : `${seatsLeft} of ${trip.max_capacity} available`
                    }
                  />
                </div>

                {/* Seat bar */}
                <div className="mt-5">
                  <div className="flex justify-between text-xs text-gray-500 mb-1.5">
                    <span>{trip.registered_count ?? 0} registered</span>
                    <span>{trip.max_capacity} capacity</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isFull ? 'bg-red-500' : seatsLeft <= 5 ? 'bg-orange-500' : 'bg-emerald-500'
                      }`}
                      style={{
                        width: `${Math.min(100, ((trip.registered_count ?? 0) / trip.max_capacity) * 100)}%`,
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="card p-6">
                <h2 className="font-heading font-bold text-primary text-xl mb-3">About This Trip</h2>
                <p className="text-gray-600 leading-relaxed">{trip.description}</p>

                {trip.organizer && (
                  <div className="mt-4 pt-4 border-t border-gray-100 flex items-center gap-2">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-primary font-bold text-sm">
                        {trip.organizer.name[0]}
                      </span>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Organized by</p>
                      <p className="text-sm font-medium text-primary">{trip.organizer.name}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Registration Form */}
            <div className="lg:col-span-1">
              <div className="card p-6 sticky top-20">
                <h2 className="font-heading font-bold text-primary text-xl mb-4">
                  {canRegister ? 'Register for Trip' : isFull ? 'Trip is Full' : 'Registration Closed'}
                </h2>

                {submitState === 'success' && (
                  <div className="flex items-start gap-2 p-3 bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-100 mb-4 text-sm">
                    <CheckCircle size={16} className="flex-shrink-0 mt-0.5" />
                    {submitMessage}
                  </div>
                )}

                {submitState === 'error' && (
                  <div className="flex items-start gap-2 p-3 bg-red-50 text-red-600 rounded-xl border border-red-100 mb-4 text-sm">
                    <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
                    {submitMessage}
                  </div>
                )}

                {!canRegister ? (
                  <div className="text-center py-6 text-gray-400">
                    <Clock size={40} className="mx-auto mb-3 opacity-30" />
                    <p className="text-sm">
                      {isCancelled
                        ? 'This trip has been cancelled.'
                        : 'This trip is fully booked. Check back for future trips.'}
                    </p>
                    <Link to="/trips" className="btn-outline mt-4 py-2 px-4 text-sm inline-flex">
                      Browse Other Trips
                    </Link>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
                    <div>
                      <label className="form-label">Full Name *</label>
                      <input {...register('name')} className="form-input" placeholder="Your full name" />
                      {errors.name && <p className="form-error">{errors.name.message}</p>}
                    </div>

                    <div>
                      <label className="form-label">Email *</label>
                      <input {...register('email')} type="email" className="form-input" placeholder="your@email.com" />
                      {errors.email && <p className="form-error">{errors.email.message}</p>}
                    </div>

                    <div>
                      <label className="form-label">Phone *</label>
                      <input {...register('phone')} className="form-input" placeholder="10-digit phone" maxLength={10} />
                      {errors.phone && <p className="form-error">{errors.phone.message}</p>}
                    </div>

                    <div>
                      <label className="form-label">Enrollment No. *</label>
                      <input {...register('enrollment_no')} className="form-input" placeholder="e.g. GU2021CS001" />
                      {errors.enrollment_no && <p className="form-error">{errors.enrollment_no.message}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="form-label">Department *</label>
                        <input {...register('department')} className="form-input" placeholder="e.g. CSE" />
                        {errors.department && <p className="form-error">{errors.department.message}</p>}
                      </div>
                      <div>
                        <label className="form-label">Year *</label>
                        <select {...register('year')} className="form-input">
                          {[1, 2, 3, 4, 5, 6].map((y) => (
                            <option key={y} value={y}>Year {y}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="form-label">Emergency Contact *</label>
                      <input {...register('emergency_contact')} className="form-input" placeholder="10-digit number" maxLength={10} />
                      {errors.emergency_contact && <p className="form-error">{errors.emergency_contact.message}</p>}
                    </div>

                    <div>
                      <label className="form-label">Medical Notes (optional)</label>
                      <textarea {...register('medical_notes')} className="form-input resize-none" rows={2} placeholder="Allergies, conditions, etc." />
                    </div>

                    <button
                      type="submit"
                      id="register-submit-btn"
                      disabled={isSubmitting}
                      className="btn-accent w-full justify-center py-3 mt-2"
                    >
                      {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : null}
                      {isSubmitting ? 'Registering...' : 'Register Now'}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

function InfoItem({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div>
      <div className="flex items-center gap-1.5 text-gray-400 text-xs mb-1">
        <Icon size={13} className="text-accent" />
        <span className="uppercase tracking-wide font-semibold">{label}</span>
      </div>
      <p className="text-primary font-semibold text-sm">{value}</p>
    </div>
  );
}
