import { Router } from 'express';
import {
  getAllJobs,
  createJob,
  updateJob,
  deleteJob,
} from '../controllers/jobController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.get('/', authenticate, getAllJobs);
router.post('/', authenticate, createJob);
router.put('/:id', authenticate, updateJob);
router.delete('/:id', authenticate, deleteJob);

export default router;
