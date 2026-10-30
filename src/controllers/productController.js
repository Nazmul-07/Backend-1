import { ObjectId } from "mongodb";
import { getDB } from "../config/db.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";

// Get products collection
export const getCollection = () => {
  return getDB().collection("products");
};
const getCategory = () => getDB().collection("category");

// POST: Create a new product
export const createProduct = asyncHandler(async (req, res) => {
  const { name, price, stock, categoryId } = req.body;

  if (!name || price === undefined || !categoryId) {
    return res.status(400).json({
      success: false,
      message: "Please provide all required fields (name, price, categoryId)",
    });
  }
  if (!ObjectId.isValid(categoryId)) {
    throw new ApiError(400, "Invalid category ID");
  }
  const category = await getCategory().findOne({
    _id: new ObjectId(categoryId),
  });
  if (!category) {
    throw new ApiError(
      404,
      "Category does not exits. Please select a valid category.",
    );
  }

  const newProduct = {
    name: String(name).trim(),
    price: Number(price),
    stock: Number(stock ?? 0),
    categoryId: category._id,
    createdAt: new Date(),
  };

  const result = await getCollection().insertOne(newProduct);

  res.status(201).json({
    success: true,
    message: "Product created successfully!",
    data: {
      _id: result.insertedId,
      ...newProduct,
    },
  });
});

// GET: Get all products
export const getProducts = asyncHandler(async (req, res) => {
  const { name, objectId } = req.query;

  const filters = {};

  if (name) {
    filters["name"] = { $regex: name, $options: "i" };
  }
  if (objectId) {
    if (!ObjectId.isValid(objectId)) {
      throw new ApiError(400, "Invalid category ID");
    }

    filters["categoryId"] = new ObjectId(objectId);
  }

  const products = await getCollection().find(filters).toArray();

  if (!products.length) {
    throw new ApiError(404, "Product not found");
  }
  res.status(200).json({
    success: true,
    count: products.length,
    data: products,
  });
});

// GET: Get product by ID
export const getProductById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid MongoDB Object format");
  }
  const product = await getCollection().findOne({ _id: new ObjectId(id) });
  if (!product) {
    throw new ApiError(404, "Product not found");
  }
  res.status(200).json({
    success: true,
    data: product,
  });
});
// PUT: Update a product by ID
export const updateProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid MongoDB Object format");
  }
  const updateFields = {
    ...req.body,
    updatedAt: new Date(),
  };

  if (updateFields.price !== undefined) {
    updateFields.price = Number(updateFields.price);
  }

  const result = await getCollection().updateOne(
    { _id: new ObjectId(id) },
    { $set: updateFields },
  );
  if (result.matchedCount === 0) {
    throw new ApiError(404, "Product not found");
  }
  const updatedProduct = await getCollection().findOne({
    _id: new ObjectId(id),
  });

  res.status(200).json({
    success: true,
    message: "Product updated successfully!",
    data: updatedProduct,
  });
});

// PATCH: Delete a product by ID
export const deleteProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid MongoDB Object format");
  }
  const result = await getCollection().deleteOne({
    _id: new ObjectId(id),
  });
  if (result.deletedCount === 0) {
    throw new ApiError(404, "Product not found");
  }
  res.status(200).json({
    success: true,
    message: "Product deleted successfully",
  });
});
