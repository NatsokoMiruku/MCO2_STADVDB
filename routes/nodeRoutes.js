import express from 'express';
import { getNodeStatus } from '../controllers/nodeController.js';

const router = express.Router();

router.get('/status', getNodeStatus);

export default router;
