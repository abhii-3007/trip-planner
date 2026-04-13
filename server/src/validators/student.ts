import { z } from 'zod';

export const createStudentSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z
    .string()
    .regex(/^\d{10}$/, 'Phone must be a 10-digit number'),
  enrollment_no: z.string().min(3, 'Enrollment number is required'),
  department: z.string().min(2, 'Department is required'),
  year: z
    .number()
    .int()
    .min(1, 'Year must be 1-6')
    .max(6, 'Year must be 1-6'),
  college_id: z.number().int().positive('College ID is required'),
});
