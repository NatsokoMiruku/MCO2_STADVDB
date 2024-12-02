import express from 'express';
import { performTransaction } from '../controllers/transactionController.js';

const router = express.Router();

router.post('/perform', performTransaction);

export default router;
