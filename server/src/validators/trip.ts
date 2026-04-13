import { z } from 'zod';

export const createTripSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  destination: z.string().min(2, 'Destination is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  start_date: z.string().refine((d) => !isNaN(Date.parse(d)), 'Invalid start date'),
  end_date: z.string().refine((d) => !isNaN(Date.parse(d)), 'Invalid end date'),
  max_capacity: z.number().int().min(1, 'Capacity must be at least 1'),
  status: z
    .enum(['upcoming', 'ongoing', 'completed', 'cancelled'])
    .optional()
    .default('upcoming'),
  image_url: z.string().url().optional().or(z.literal('')),
});

export const updateTripSchema = createTripSchema.partial();
