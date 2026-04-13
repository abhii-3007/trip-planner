import { z } from 'zod';

export const createRegistrationSchema = z.object({
  trip_id: z.number().int().positive('Trip ID is required'),
  student_id: z.number().int().positive('Student ID is required'),
  emergency_contact: z
    .string()
    .regex(/^\d{10}$/, 'Emergency contact must be 10 digits'),
  medical_notes: z.string().optional(),
});

export const updatePaymentStatusSchema = z.object({
  payment_status: z.enum(['paid', 'pending', 'waived']),
});
