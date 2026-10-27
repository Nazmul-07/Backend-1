import express from "express";
import { createCategory, deleteCategory, getCategoryByID, getCategorys, updateCategory } from "../controllers/productCategoryController.js";

const router = express.Router();

router.post('/product-category', createCategory)
router.get('/product-category', getCategorys)
router.delete('/product-category/:id', deleteCategory)
router.get('/product-category/:id', getCategoryByID)
router.patch('/product-category/:id', updateCategory)


const productCategoryRouter = router;

export default productCategoryRouter;