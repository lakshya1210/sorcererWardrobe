import mongoose from "mongoose";

const cartItemSchema = mongoose.Schema({
    productId: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 1
    }
})

const cartSchema = mongoose.Schema({
    userId: {
        type: String,
        required: true,
        unique: true,
    },
    items: [cartItemSchema],
}, {timestamps: true})

const Cart = mongoose.model('Cart', cartSchema)
export default Cart