import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: [true, 'Please provide product ID'],
    },
    quantity: {
        type: Number,
        required: true,
    },
});

const addressSchema = new mongoose.Schema({
    addressLine1: {
        type: String,
        default: "",
    },
    addressLine2: {
        type: String,
        default: "",
    },
    addressLine3: {
        type: String,
        default: "",
    },
    pincode: {
        type: Number,
        default: null,
        match: [/^\d{6}$/, 'Please provide a valid pincode']
    }
});

const OrderSchema = new mongoose.Schema({
    order_id: {
        type: String,
        required: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Please provide user ID'],
    },
    address: {
        type: addressSchema,
        required: [true, 'Please provide address'],
    },
    products: [ProductSchema],
    total_amount: {
        type: Number,
        required: [true, 'Please provide amount'],
    },
    currency: {
        type: String,
        required: [true, 'Please provide currency'],
    },
    status: {
        type: String,
        required: true,
        default: 'created',
    },
    deliveryStatus: {
        type: String,
        enum: ['failed','ordered', 'shipped', 'out for delivery', 'delivered'],
        default: 'ordered',
    },
}, {timestamps: true});

const Order = mongoose.model("Order", OrderSchema)
export default Order