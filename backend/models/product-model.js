import mongoose from "mongoose";

const productSchema = mongoose.Schema({
    name: {
        type: String, 
        required: [true, 'Please provide product name']
    },
    description: {
        type: String, 
        required: [true, 'Please provide product description']
    },
    price: {
        type: Number, 
        required: [true, 'Please provide product price']
    },
    quantity: {
        type: Number,
        required: [true, 'Please provide quantity']
    },
    categories: {
        type: [String], 
        required: [true, 'Please specify atleast 1 category']
    },
    brand: {
        type: String, 
        required: [true, 'Please provide brand name']
    },
    images: {
        type: [String], 
        required: [true, 'Please specify atleast 1 category'],
        default: 'https://www.tiffincurry.ca/wp-content/uploads/2021/02/default-product.png'
    }
}, { timestamps: true })

const Product = mongoose.model('Product', productSchema)
export default Product