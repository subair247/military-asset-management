import express from 'express';
import { login, getProfile } from '../controllers/authController.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/login', login);
router.get('/me', authenticateToken, getProfile);

export default router;