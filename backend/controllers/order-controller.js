import { StatusCodes } from "http-status-codes";
import Order from "../models/order-model.js"
import { NotFoundError, BadRequestError, UnauthenticatedError } from "../errors/index.js";

export const getOrders = async (req, res) => {
    const { q, dStatus, userId } = req.query
    
    const query = {}
    if (q) {
        query.$or = [
            { order_id: { $regex: q, $options: 'i' } },
        ]
    }
    if(dStatus){
        query.deliveryStatus = dStatus
    }
    
    const start = parseInt(req.query.start || 0)
    const limit = parseInt(req.query.limit || 8)
    const sortDirection = req.query.sort === 'asc' ? 1 : -1

    let orders;
    if (userId && userId===req.user.userId) {
        orders = await Order.find({ userId: req.user.userId }).populate('products.productId').sort({ updatedAt: sortDirection });
    }
    else {
        orders = await Order.find(query).populate('userId').populate('products.productId').sort({ updatedAt: sortDirection }).skip(start).limit(limit);
    }
    if (!orders) {
        throw new NotFoundError('No orders found!')
    }
    res.status(StatusCodes.OK).json(orders);
};

export const updateDeliveryStatus = async (req, res) => {
    if (!req.user.isAdmin) {
        throw new UnauthenticatedError('Only admins can chagne delivery status')
    }
    const { orderId } = req.params;
    const { deliveryStatus } = req.body;

    const validStatuses = ['failed','ordered', 'shipped', 'out for delivery', 'delivered'];
    if (!validStatuses.includes(deliveryStatus)) {
        throw new BadRequestError('Invalid delivery status')
    }

    const order = await Order.findByIdAndUpdate(orderId, { deliveryStatus }, { new: true }).populate('products.productId');
    if (!order) {
        throw new NotFoundError('Order not found')
    }
    res.status(StatusCodes.OK).json(order)
}