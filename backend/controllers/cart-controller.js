import Cart from '../models/cart-model.js'
import Product from '../models/product-model.js'
import { StatusCodes } from 'http-status-codes'
import { BadRequestError, NotFoundError } from '../errors/index.js'

export const addToCart = async(req, res) => {
    const userId = req.user.userId
    const {productId, quantity} = req.body;
    const product = await Product.findById(productId)

    if(!product){
        throw new NotFoundError('Product not found')
    }
    if(quantity > product.quantity){
        throw new BadRequestError(`Only ${product.quantity} left in stock!`)
    }
    let cart = await Cart.findOne({userId})

    if(cart){
        const itemIndex = cart.items.findIndex(item => item.productId === productId)
        if(itemIndex > -1){
            const newQuantity = cart.items[itemIndex].quantity + quantity
            if(newQuantity > product.quantity){
                throw new BadRequestError(`Only ${product.quantity} left in stock!`)
            }
            cart.items[itemIndex].quantity = newQuantity
        }
        else{
            cart.items.push({productId, quantity})
        }
    }
    else{
        cart = new Cart({userId, items: [{productId, quantity}]})
    }
    await cart.save()
    res.status(StatusCodes.OK).json(cart)
}

export const getCart = async(req, res) => {
    const userId = req.user.userId
    const cart = await Cart.findOne({userId})

    if(!cart){
        throw new NotFoundError('Cart is empty!')
    }
    const populatedItems = await Promise.all(
        cart.items.map(async (item) => {
            const prod = await Product.findById(item.productId)
            return {...item.toObject(), prod}
        })
    )
    res.status(StatusCodes.OK).json({...cart.toObject(), items: populatedItems})
}

export const updateCart = async(req, res) => {
    const userId = req.user.userId
    const {productId, quantity} = req.body;
    const product = await Product.findById(productId)

    if(!product){
        throw new NotFoundError('Product not found')
    }
    if(quantity > product.quantity){
        throw new BadRequestError(`Only ${product.quantity} left in stock!`)
    }
    let cart = await Cart.findOne({userId})
    if(!cart){
        throw new NotFoundError('Cart not found')
    }
    const itemIndex = cart.items.findIndex(item => item.productId === productId)
    if(itemIndex > -1){
        cart.items[itemIndex].quantity = quantity
    }
    else{
        throw new NotFoundError('Product not found in cart')
    }
    await cart.save()
    res.status(StatusCodes.OK).json(cart)
}

export const removeFromCart = async(req, res) => {
    const userId = req.user.userId
    const { productId} = req.body;
    const cart = await Cart.findOne({userId})
    if(!cart){
        throw new NotFoundError('Cart not found')
    }
    cart.items = cart.items.filter(item => item.productId !== productId)
    await cart.save()
    res.status(StatusCodes.OK).json(cart)
}