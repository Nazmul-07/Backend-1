import express from "express"
import { createProduct, deleteProduct, getProductById, getProducts, updateProduct } from "../controllers/productController.js";

const router = express.Router();

router.get('/product',getProducts)
router.post('/product', createProduct);
router.get('/product', getProductById);
router.get('/product', updateProduct);
router.get('/product', deleteProduct);


router.get('/product/category', (req, res)=>{
    res.status(200).json({
        success: true,
        message: "This is from Product Category!"
    })
})
export default router;
