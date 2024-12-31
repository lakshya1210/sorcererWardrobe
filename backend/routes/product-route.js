import express from 'express'
import auth from '../middlewares/authentication.js'
import { createProduct, deleteProduct, getSingleProduct, searchProduct, updateProduct } from '../controllers/product-controller.js'

const router = express.Router()

router.post('/add', auth, createProduct)
router.get('/search', searchProduct)
router.get('/:prodId', getSingleProduct)
router.put('/update/:prodId', auth, updateProduct)
router.delete('/delete/:prodId', auth, deleteProduct)

export default router