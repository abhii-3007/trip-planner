import { Router } from 'express';
import {
  createRegistration,
  listRegistrations,
  updatePaymentStatus,
} from '../controllers/registrationController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.post('/', createRegistration);
router.get('/', authenticate, listRegistrations);
router.put('/:id/payment', authenticate, updatePaymentStatus);

export default router;
