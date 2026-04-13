import { Link } from 'react-router-dom';
import { MapPin, Calendar, Users, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';
import { Trip } from '../lib/types';

interface TripCardProps {
  trip: Trip;
}

const STATUS_BADGE: Record<string, string> = {
  upcoming:  'badge-upcoming',
  ongoing:   'badge-ongoing',
  completed: 'badge-completed',
  cancelled: 'badge-cancelled',
};

const DEFAULT_IMAGES = [
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=75',
  'https://images.unsplash.com/photo-1477587458883-47145ed31ffd?w=600&q=75',
  'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&q=75',
  'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=600&q=75',
];

export default function TripCard({ trip }: TripCardProps) {
  const seatsLeft = trip.seats_left ?? (trip.max_capacity - (trip.registered_count ?? 0));
  const isFull = seatsLeft <= 0;
  const imageSrc = trip.image_url || DEFAULT_IMAGES[trip.id % DEFAULT_IMAGES.length];

  return (
    <article className="card group animate-slide-up" id={`trip-card-${trip.id}`}>
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={imageSrc}
          alt={trip.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

        {/* Status badge */}
        <span className={`absolute top-3 left-3 ${STATUS_BADGE[trip.status]} capitalize`}>
          {trip.status}
        </span>

        {/* Seats left chip */}
        <span
          className={`absolute top-3 right-3 text-xs font-semibold px-2.5 py-1 rounded-full ${
            isFull
              ? 'bg-red-500 text-white'
              : seatsLeft <= 5
              ? 'bg-orange-500 text-white'
              : 'bg-white/90 text-primary'
          }`}
        >
          {isFull ? 'Full' : `${seatsLeft} seats left`}
        </span>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="font-heading font-bold text-primary text-lg leading-snug mb-1 line-clamp-2">
          {trip.title}
        </h3>

        <div className="flex items-center gap-1.5 text-gray-500 text-sm mb-3">
          <MapPin size={14} className="text-accent flex-shrink-0" />
          <span className="truncate">{trip.destination}</span>
        </div>

        <p className="text-gray-600 text-sm leading-relaxed line-clamp-2 mb-4">
          {trip.description}
        </p>

        {/* Meta row */}
        <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
          <div className="flex items-center gap-1">
            <Calendar size={13} className="text-accent" />
            <span>{format(new Date(trip.start_date), 'MMM d')} – {format(new Date(trip.end_date), 'MMM d, yyyy')}</span>
          </div>
          <div className="flex items-center gap-1">
            <Users size={13} className="text-accent" />
            <span>{trip.registered_count ?? 0} / {trip.max_capacity}</span>
          </div>
        </div>

        {/* CTA */}
        <Link
          to={`/trips/${trip.id}`}
          id={`trip-card-link-${trip.id}`}
          className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
            isFull || trip.status === 'cancelled'
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed pointer-events-none'
              : 'bg-primary text-white hover:bg-primary-700'
          }`}
        >
          {isFull ? 'Trip Full' : 'View & Register'}
          {!isFull && <ArrowRight size={15} />}
        </Link>
      </div>
    </article>
  );
}
