import express from 'express';
import { createOrder, getMyOrders, getOrders, updateOrderStatus } from '../controllers/orderController.js';
import { admin, protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').post(protect, createOrder).get(protect, admin, getOrders);
router.get('/my', protect, getMyOrders);
router.patch('/:id/status', protect, admin, updateOrderStatus);

export default router;

