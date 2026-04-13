import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { createStudentSchema } from '../validators/student';

const prisma = new PrismaClient();

/** POST /api/students — register a new student */
export const createStudent = async (req: Request, res: Response): Promise<void> => {
  const parsed = createStudentSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten().fieldErrors });
    return;
  }

  try {
    const student = await prisma.student.create({ data: parsed.data });
    res.status(201).json(student);
  } catch (err: any) {
    if (err.code === 'P2002') {
      const field = err.meta?.target?.[0];
      res.status(409).json({ error: `A student with this ${field} already exists` });
      return;
    }
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

/** GET /api/students — list all students (admin/coordinator) */
export const listStudents = async (req: Request, res: Response): Promise<void> => {
  const { search, department, year } = req.query;

  try {
    const students = await prisma.student.findMany({
      where: {
        AND: [
          search
            ? {
                OR: [
                  { name: { contains: String(search), mode: 'insensitive' } },
                  { email: { contains: String(search), mode: 'insensitive' } },
                  { enrollment_no: { contains: String(search), mode: 'insensitive' } },
                ],
              }
            : {},
          department ? { department: { equals: String(department), mode: 'insensitive' } } : {},
          year ? { year: parseInt(String(year)) } : {},
        ],
      },
      include: {
        college: { select: { name: true } },
        _count: { select: { registrations: true } },
      },
      orderBy: { created_at: 'desc' },
    });

    res.json(students);
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
};

/** GET /api/students/:id — get single student */
export const getStudentById = async (req: Request, res: Response): Promise<void> => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) { res.status(400).json({ error: 'Invalid ID' }); return; }

  try {
    const student = await prisma.student.findUnique({
      where: { id },
      include: {
        college: true,
        registrations: {
          include: { trip: { select: { id: true, title: true, destination: true, start_date: true } } },
        },
      },
    });
    if (!student) { res.status(404).json({ error: 'Student not found' }); return; }
    res.json(student);
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
};
