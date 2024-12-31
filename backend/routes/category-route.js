import express from 'express'
import auth from '../middlewares/authentication.js'
import { addCategory, deleteCategory, getAllCategories, updateCategory } from '../controllers/category-controller.js'
const router = express.Router()


router.post('/add', auth, addCategory)
router.get('/getCategories', getAllCategories)
router.delete('/delete/:catId', auth, deleteCategory)
router.put('/update/:catId', auth, updateCategory)

export default router