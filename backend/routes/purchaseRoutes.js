import express from 'express';
import { createPurchase, getPurchases } from '../controllers/purchaseController.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';
import { authorizeRoles, enforceBaseScope } from '../middlewares/rbacMiddleware.js';
import { logAuditTrail } from '../middlewares/loggerMiddleware.js';

const router = express.Router();

router.post('/', authenticateToken, authorizeRoles('ADMIN', 'LOGISTICS_OFFICER'), logAuditTrail('PURCHASE'), createPurchase);
router.get('/', authenticateToken, enforceBaseScope, getPurchases);

export default router;