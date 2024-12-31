import Product from "../models/product-model.js";
import { StatusCodes } from 'http-status-codes'
import { BadRequestError, NotFoundError, UnauthenticatedError } from '../errors/index.js'


export const createProduct = async(req, res)=> {
    if(!req.user.isAdmin){
        throw new UnauthenticatedError('Only admins can add new product')
    }
    const {name, description, price, quantity, categories, brand, images} = req.body

    if (!name || !description || !price || !quantity || !brand) {
        throw new BadRequestError('Please provide all fields')
    }
    if (!categories || !Array.isArray(categories) || categories.length === 0) {
        throw new BadRequestError('Please provide at least one category');
    }

    const product = await Product.create({name, description, price, quantity, categories, brand, images});
    res.status(StatusCodes.OK).json(product)
}

export const searchProduct = async(req, res) =>{ 
    const {q, categories, brand} = req.query
    
    const query = {}
    if(q){
        query.$or = [
            {name: {$regex: q, $options: 'i'}},
            {description: {$regex: q, $options: 'i'}},
            {brand: {$regex: q, $options: 'i'}},
        ]
    }
    if(brand){
        query.brand = {$regex: brand, $options: 'i'}
    }
    if(categories){
        const categoryArray = categories.split(',').map((cat) => cat.trim())
        query.categories = {$all: categoryArray}
    }

    const start = parseInt(req.query.start || 0)
    const limit = parseInt(req.query.limit || 8)
    const sortDirection = req.query.sort === 'asc' ? 1 : -1

    const products = await Product.find(query).sort({updatedAt: sortDirection}).skip(start).limit(limit)
    const totalProducts = await Product.countDocuments(query)
    res.status(StatusCodes.OK).json({products, totalProducts})
}

export const getSingleProduct = async(req, res) =>{ 
    const product = await Product.findById(req.params.prodId);
    if(!product){
        throw new NotFoundError('Product not found')
    }
    res.status(StatusCodes.OK).json(product)
}

export const updateProduct = async(req, res) =>{ 
    if(!req.user.isAdmin){
        throw new UnauthenticatedError('Only admins can update product details')
    }
    const {...newDetails} = req.body
    if(Object.keys(newDetails).length === 0){
        throw new BadRequestError('Please provide atleast one field to update')
    }

    const updatedProduct = await Product.findByIdAndUpdate(
        req.params.prodId,
        {$set: newDetails},
        {new: true, runValidators: true }
    )
    if(!updatedProduct){
        throw new NotFoundError('Product not found')
    }
    res.status(StatusCodes.OK).json(updatedProduct)
}

export const deleteProduct = async(req, res) => {
    if(!req.user.isAdmin){
        throw new UnauthenticatedError('Only admins can delete product')
    }
    const deletedProduct = await Product.findByIdAndDelete(req.params.prodId)
    if(!deletedProduct){
        throw new NotFoundError('Product not found')
    }
    res.status(StatusCodes.OK).json('Product deleted successfully')
}
