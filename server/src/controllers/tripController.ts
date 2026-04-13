import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { createTripSchema, updateTripSchema } from '../validators/trip';

const prisma = new PrismaClient();

/** GET /api/trips — list all trips with seat availability */
export const listTrips = async (req: Request, res: Response): Promise<void> => {
  try {
    const { status } = req.query;

    const trips = await prisma.trip.findMany({
      where: status ? { status: status as any } : undefined,
      include: {
        organizer: { select: { id: true, name: true } },
        _count: { select: { registrations: true } },
      },
      orderBy: { start_date: 'asc' },
    });

    const tripsWithSeats = trips.map((t) => ({
      ...t,
      registered_count: t._count.registrations,
      seats_left: t.max_capacity - t._count.registrations,
    }));

    res.json(tripsWithSeats);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

/** GET /api/trips/:id — trip detail with registrations */
export const getTripById = async (req: Request, res: Response): Promise<void> => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) { res.status(400).json({ error: 'Invalid trip ID' }); return; }

  try {
    const trip = await prisma.trip.findUnique({
      where: { id },
      include: {
        organizer: { select: { id: true, name: true } },
        _count: { select: { registrations: true } },
      },
    });

    if (!trip) { res.status(404).json({ error: 'Trip not found' }); return; }

    res.json({
      ...trip,
      registered_count: trip._count.registrations,
      seats_left: trip.max_capacity - trip._count.registrations,
    });
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
};

/** POST /api/trips — create trip (admin/coordinator) */
export const createTrip = async (req: Request, res: Response): Promise<void> => {
  const parsed = createTripSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten().fieldErrors });
    return;
  }

  const data = parsed.data;
  try {
    const trip = await prisma.trip.create({
      data: {
        ...data,
        start_date: new Date(data.start_date),
        end_date: new Date(data.end_date),
        image_url: data.image_url || null,
        organizer_id: req.user!.id,
      },
    });
    res.status(201).json(trip);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

/** PUT /api/trips/:id — update trip */
export const updateTrip = async (req: Request, res: Response): Promise<void> => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) { res.status(400).json({ error: 'Invalid trip ID' }); return; }

  const parsed = updateTripSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten().fieldErrors });
    return;
  }

  const data = parsed.data;
  try {
    const trip = await prisma.trip.update({
      where: { id },
      data: {
        ...data,
        start_date: data.start_date ? new Date(data.start_date) : undefined,
        end_date: data.end_date ? new Date(data.end_date) : undefined,
        image_url: data.image_url ?? undefined,
      },
    });
    res.json(trip);
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
};

/** DELETE /api/trips/:id — delete trip (admin only) */
export const deleteTrip = async (req: Request, res: Response): Promise<void> => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) { res.status(400).json({ error: 'Invalid trip ID' }); return; }

  try {
    await prisma.trip.delete({ where: { id } });
    res.json({ message: 'Trip deleted' });
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
};
