import express from 'express'
import auth from '../middlewares/authentication.js'
import { addToCart, getCart, removeFromCart, updateCart } from '../controllers/cart-controller.js'
const router = express.Router()

router.get('/', auth, getCart)
router.post('/', auth, addToCart)
router.put('/', auth, updateCart)
router.delete('/', auth, removeFromCart)

export default router