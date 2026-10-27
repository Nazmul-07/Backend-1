import express from "express"
import { createProduct, deleteProduct, getProductById, getProducts, updateProduct } from "../controllers/productController.js";

const router = express.Router();

router.post('/product', createProduct);
router.get('/product',getProducts);
router.get('/product/:id', getProductById);
router.patch('/product/:id', updateProduct);
router.delete('/product/:id', deleteProduct);

const productRouter = router;
export default productRouter;

