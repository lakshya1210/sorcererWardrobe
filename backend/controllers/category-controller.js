import Category from "../models/category-model.js";
import { StatusCodes } from 'http-status-codes'
import { BadRequestError, NotFoundError, UnauthenticatedError } from '../errors/index.js'
import Product from "../models/product-model.js";

export const addCategory = async (req, res) => {
    if (!req.user.isAdmin) {
        throw new UnauthenticatedError('Only admins can add new category')
    }
    const category = await Category.create(req.body)
    res.status(StatusCodes.OK).json(category)
}

export const getAllCategories = async (req, res) => {
    
    const start = parseInt(req.query.start || 0)
    const limit = parseInt(req.query.limit || 0)
    const sortDirection = req.query.sort === 'desc' ? -1 : 1

    const category = await Category.find().sort({createdAt: sortDirection}).skip(start).limit(limit)
    res.status(StatusCodes.OK).json(category)
}

export const deleteCategory = async (req, res) => {
    if (!req.user.isAdmin) {
        throw new UnauthenticatedError('Only admins can delete category')
    }
    const category = await Category.findByIdAndDelete(req.params.catId)
    if (!category) {
        throw new NotFoundError('Category not found')
    }
    res.status(StatusCodes.OK).json('Category deleted successfully!')
}

export const updateCategory = async (req, res) => {
    if (!req.user.isAdmin) {
        throw new UnauthenticatedError('Only admins can edit category')
    }
    const { oldName, newName } = req.body
    if (!oldName || !newName) {
        throw new BadRequestError('Please provide all fields')
    }

    await Product.updateMany({ categories: oldName }, { $set: { 'categories.$': newName } })

    const category = await Category.findByIdAndUpdate(req.params.catId, { name: newName }, { new: true, runValidators: true })
    if (!category) {
        throw new NotFoundError('No category found')
    }
    res.status(StatusCodes.OK).json(category)
}