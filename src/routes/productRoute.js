import express from "express"
import { createProduct, getCollection } from "../controllers/productController.js";

const router = express.Router();

router.get('/product',getCollection)
router.post('/product', createProduct);

router.get('/product/category', (req, res)=>{
    res.status(200).json({
        success: true,
        message: "This is from Product Category!"
    })
})
export default router;
