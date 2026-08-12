import express from 'express';
import { 
  getDashboardMetrics, 
  getMetadata, 
  getPurchases, 
  createPurchase, 
  getTransfers, 
  createTransfer, 
  getAssignments, 
  createAssignment 
} from '../controllers/assetController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('/metrics', getDashboardMetrics);
router.get('/meta', getMetadata);
router.get('/metadata', getMetadata);

router.get('/purchases', getPurchases);
router.post('/purchases', createPurchase);

router.get('/transfers', getTransfers);
router.post('/transfers', createTransfer);

router.get('/assignments', getAssignments);
router.post('/assignments', createAssignment);

export default router;