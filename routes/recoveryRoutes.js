import express from 'express';
import { simulateRecovery } from '../controllers/recoveryController.js';

const router = express.Router();

router.post('/', simulateRecovery);

export default router;
