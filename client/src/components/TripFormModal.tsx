import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, Loader2 } from 'lucide-react';
import api from '../lib/axios';
import { Trip } from '../lib/types';

const tripSchema = z
  .object({
    title: z.string().min(3, 'Title must be at least 3 characters'),
    destination: z.string().min(2, 'Destination is required'),
    description: z.string().min(10, 'Description must be at least 10 characters'),
    start_date: z.string().min(1, 'Start date is required'),
    end_date: z.string().min(1, 'End date is required'),
    max_capacity: z.coerce.number().int().min(1, 'Min capacity is 1'),
    status: z.enum(['upcoming', 'ongoing', 'completed', 'cancelled']),
    image_url: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  })
  .refine((d) => d.end_date >= d.start_date, {
    message: 'End date must be after start date',
    path: ['end_date'],
  });

type TripForm = z.infer<typeof tripSchema>;

interface Props {
  trip?: Trip | null;
  onClose: () => void;
  onSaved: () => void;
}

export default function TripFormModal({ trip, onClose, onSaved }: Props) {
  const isEdit = !!trip;
  const [serverError, setServerError] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TripForm>({
    resolver: zodResolver(tripSchema),
    defaultValues: {
      status: 'upcoming',
    },
  });

  useEffect(() => {
    if (trip) {
      reset({
        title: trip.title,
        destination: trip.destination,
        description: trip.description,
        start_date: trip.start_date.slice(0, 10),
        end_date: trip.end_date.slice(0, 10),
        max_capacity: trip.max_capacity,
        status: trip.status,
        image_url: trip.image_url ?? '',
      });
    }
  }, [trip, reset]);

  const onSubmit = async (data: TripForm) => {
    setServerError('');
    try {
      if (isEdit) {
        await api.put(`/trips/${trip!.id}`, data);
      } else {
        await api.post('/trips', data);
      }
      onSaved();
      onClose();
    } catch (err: any) {
      setServerError(err.response?.data?.error || 'Failed to save trip');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="font-heading font-bold text-primary text-lg">
            {isEdit ? 'Edit Trip' : 'New Trip'}
          </h2>
          <button
            onClick={onClose}
            id="modal-close-btn"
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="px-6 py-5 space-y-4">
          {serverError && (
            <div className="p-3 bg-red-50 text-red-600 text-sm rounded-xl border border-red-100">
              {serverError}
            </div>
          )}

          <div>
            <label className="form-label">Trip Title *</label>
            <input {...register('title')} className="form-input" placeholder="e.g. Himalayan Science Expedition" />
            {errors.title && <p className="form-error">{errors.title.message}</p>}
          </div>

          <div>
            <label className="form-label">Destination *</label>
            <input {...register('destination')} className="form-input" placeholder="e.g. Manali, Himachal Pradesh" />
            {errors.destination && <p className="form-error">{errors.destination.message}</p>}
          </div>

          <div>
            <label className="form-label">Description *</label>
            <textarea
              {...register('description')}
              className="form-input resize-none"
              rows={3}
              placeholder="Describe the trip objectives and activities..."
            />
            {errors.description && <p className="form-error">{errors.description.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="form-label">Start Date *</label>
              <input type="date" {...register('start_date')} className="form-input" />
              {errors.start_date && <p className="form-error">{errors.start_date.message}</p>}
            </div>
            <div>
              <label className="form-label">End Date *</label>
              <input type="date" {...register('end_date')} className="form-input" />
              {errors.end_date && <p className="form-error">{errors.end_date.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="form-label">Max Capacity *</label>
              <input type="number" {...register('max_capacity')} className="form-input" min={1} />
              {errors.max_capacity && <p className="form-error">{errors.max_capacity.message}</p>}
            </div>
            <div>
              <label className="form-label">Status</label>
              <select {...register('status')} className="form-input">
                <option value="upcoming">Upcoming</option>
                <option value="ongoing">Ongoing</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          <div>
            <label className="form-label">Image URL (optional)</label>
            <input
              {...register('image_url')}
              className="form-input"
              placeholder="https://images.unsplash.com/..."
            />
            {errors.image_url && <p className="form-error">{errors.image_url.message}</p>}
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-outline flex-1 justify-center py-2.5">
              Cancel
            </button>
            <button
              type="submit"
              id="modal-save-btn"
              disabled={isSubmitting}
              className="btn-primary flex-1 justify-center py-2.5"
            >
              {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : null}
              {isEdit ? 'Save Changes' : 'Create Trip'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
