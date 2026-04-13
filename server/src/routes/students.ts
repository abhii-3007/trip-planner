import { Router } from 'express';
import {
  createStudent,
  listStudents,
  getStudentById,
} from '../controllers/studentController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.post('/', createStudent);
router.get('/', authenticate, listStudents);
router.get('/:id', authenticate, getStudentById);

export default router;
