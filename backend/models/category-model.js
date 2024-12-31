import mongoose from "mongoose";

const categorySchema = mongoose.Schema({
    name: {
        type: String,
        unique: true,
        required: [true, 'Please provide category name']
    }
}, {timestamps: true})

const Category = mongoose.model("Category", categorySchema)
export default Category