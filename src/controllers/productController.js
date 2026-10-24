
import { getDB } from "../config/db.js";

// Get products collection
export const getCollection = () => {
  return getDB().collection("products");
};

// GET: Get all products
export const getProducts = async (req, res) => {
  try {
    const products = await getCollection().find({}).toArray();

    res.status(200).json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// POST: Create a new product
export const createProduct = async (req, res) => {
  try {
    const product = req.body;

    // Check empty request body
    if (!product || Object.keys(product).length === 0) {
      return res.status(400).json({
        success: false,
        message: "Product data is required!",
      });
    }

    const result = await getCollection().insertOne(product);

    res.status(201).json({
      success: true,
      message: "Product created successfully!",
      insertedId: result.insertedId,
      data: {
        _id: result.insertedId,
        ...product,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
