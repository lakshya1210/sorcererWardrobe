import express from 'express'
import auth from '../middlewares/authentication.js'
import { createOrder, verifySignature } from '../controllers/razorpay-controller.js';
import { getOrders, updateDeliveryStatus } from '../controllers/order-controller.js';
const router = express.Router();

router.post('/razorpay', auth, createOrder);
router.get('/', auth, getOrders);
router.post('/razorpay/verify', auth, verifySignature)
router.put('/:orderId', auth, updateDeliveryStatus)

export default router
