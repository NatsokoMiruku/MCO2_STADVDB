import express from 'express';
import { getGames } from '../controllers/gameController.js';

const router = express.Router();

// Dashboard route
router.get('/dashboard', getGames);

export default router;
