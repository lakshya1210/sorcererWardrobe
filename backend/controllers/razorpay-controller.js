import Razorpay from "razorpay"
import Order from "../models/order-model.js"
import Product from "../models/product-model.js"
import dotenv from 'dotenv'
import NotFoundError from "../errors/not-found.js";
import { StatusCodes } from "http-status-codes";
import crypto from 'crypto'
dotenv.config()

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export const createOrder = async (req, res) => {
    const { userId, address, products, total_amount, currency } = req.body;
    const options = {
        amount: total_amount * 100,
        currency,
        receipt: `receipt_${Date.now()}`,
    };

    const response = await razorpay.orders.create(options);
    for (const product of products) {
        const { productId, quantity } = product;
        const productInDb = await Product.findById(productId);

        if (productInDb) {
            productInDb.quantity = productInDb.quantity - quantity;
            await productInDb.save();
        } else {
            return res.status(StatusCodes.BAD_REQUEST).json(`Product with ID ${productId} not found`);
        }
    }
    const newOrder = new Order({
        order_id: response.id,
        userId,
        address,
        products,
        total_amount: total_amount,
        currency: response.currency,
        status: response.status,
        deliveryStatus: 'ordered'
    });
    await newOrder.save();
    res.json({ orderId: response.id, currency: response.currency, amount: response.amount });
};

export const verifySignature = async (req, res) => {
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;

    const generated_signature = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        .update(razorpay_order_id + "|" + razorpay_payment_id)
        .digest('hex');

    if (generated_signature === razorpay_signature) {
        const order = await Order.findOne({ order_id: razorpay_order_id });
        if (!order) {
            throw new NotFoundError('Order not found!');
        }
        const payment = await razorpay.payments.fetch(razorpay_payment_id);

        if (payment.status === "captured") {
            order.status = "successful";
            await order.save();
            return res.status(StatusCodes.OK).json('Payment verified and captured successfully');
        } else {
            order.status = payment.status;
            order.deliveryStatus = 'failed'
            await order.save();
            return res.status(StatusCodes.BAD_REQUEST).json(`Payment not captured, current status: ${payment.status}`);
        }
    }
    else {
        res.status(StatusCodes.BAD_REQUEST).json('Payment not verified, invalid signature');
    }
}