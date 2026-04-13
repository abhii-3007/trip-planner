import { Router } from 'express';
import {
  listTrips,
  getTripById,
  createTrip,
  updateTrip,
  deleteTrip,
} from '../controllers/tripController';
import { authenticate, requireAdmin } from '../middleware/auth';

const router = Router();

router.get('/', listTrips);
router.get('/:id', getTripById);
router.post('/', authenticate, createTrip);
router.put('/:id', authenticate, updateTrip);
router.delete('/:id', authenticate, requireAdmin, deleteTrip);

export default router;
