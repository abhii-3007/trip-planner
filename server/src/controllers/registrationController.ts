import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import {
  createRegistrationSchema,
  updatePaymentStatusSchema,
} from '../validators/registration';

const prisma = new PrismaClient();

/** POST /api/registrations — register a student for a trip */
export const createRegistration = async (
  req: Request,
  res: Response
): Promise<void> => {
  const parsed = createRegistrationSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten().fieldErrors });
    return;
  }

  const { trip_id, student_id, emergency_contact, medical_notes } = parsed.data;

  try {
    // Check trip capacity
    const trip = await prisma.trip.findUnique({
      where: { id: trip_id },
      include: { _count: { select: { registrations: true } } },
    });

    if (!trip) { res.status(404).json({ error: 'Trip not found' }); return; }
    if (trip.status === 'cancelled') {
      res.status(400).json({ error: 'Cannot register for a cancelled trip' });
      return;
    }
    if (trip._count.registrations >= trip.max_capacity) {
      res.status(409).json({ error: 'Trip is fully booked' });
      return;
    }

    const student = await prisma.student.findUnique({ where: { id: student_id } });
    if (!student) { res.status(404).json({ error: 'Student not found' }); return; }

    const registration = await prisma.tripRegistration.create({
      data: { trip_id, student_id, emergency_contact, medical_notes },
      include: {
        trip: { select: { title: true, destination: true } },
        student: { select: { name: true, email: true } },
      },
    });

    res.status(201).json(registration);
  } catch (err: any) {
    if (err.code === 'P2002') {
      res.status(409).json({ error: 'Student is already registered for this trip' });
      return;
    }
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

/** GET /api/registrations?trip_id= — list registrations (admin) */
export const listRegistrations = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { trip_id } = req.query;

  try {
    const registrations = await prisma.tripRegistration.findMany({
      where: trip_id ? { trip_id: parseInt(String(trip_id)) } : undefined,
      include: {
        trip: { select: { id: true, title: true, destination: true, start_date: true } },
        student: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            department: true,
            year: true,
            enrollment_no: true,
          },
        },
      },
      orderBy: { registered_at: 'desc' },
    });

    res.json(registrations);
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
};

/** PUT /api/registrations/:id/payment — update payment status */
export const updatePaymentStatus = async (
  req: Request,
  res: Response
): Promise<void> => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) { res.status(400).json({ error: 'Invalid registration ID' }); return; }

  const parsed = updatePaymentStatusSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten().fieldErrors });
    return;
  }

  try {
    const registration = await prisma.tripRegistration.update({
      where: { id },
      data: { payment_status: parsed.data.payment_status },
    });
    res.json(registration);
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
};
