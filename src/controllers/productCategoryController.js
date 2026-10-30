import { ObjectId } from "mongodb";
import { getDB } from "../config/db.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";

export const getCollection = () => {
  return getDB().collection("products");
};
const getCategory = () => getDB().collection("category");

// createa category;
export const createCategory = asyncHandler(async (req, res) => {
  const { category } = req.body;

  if (!category || typeof category !== "string") {
    throw new ApiError(400, "Provide the Category Name");
  }

  const newCategory = {
    category: category.trim(),
    createdAt: new Date(),
  };

  const result = await getCategory().insertOne(newCategory);

  res.status(201).json({
    success: true,
    message: "New Category added successfully!",
    data: {
      _id: result.insertedId,
      ...newCategory,
    },
  });
});

// get all category;
export const getCategorys = asyncHandler(async (req, res) => {
  const categorys = await getCategory().find({}).toArray();
  res.status(200).json({
    success: true,
    categoryCount: categorys.length,
    data: categorys,
  });
});

// get category by id;
export const getCategoryByID = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid MongoDB Object format");
  }
  const category = await getCategory().findOne({ _id: new ObjectId(id) });
  if (!category) {
    throw new ApiError(404, "Category not found");
  }
  res.status(200).json({
    success: true,
    message: category,
  });
});

// update category;
export const updateCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { category } = req.body;

  if (!ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid MongoDB Object format");
  }

  if (typeof category !== "string") {
    throw new ApiError(400, "Please provide a valid category name");
  }

  const updateField = {
    category: category.trim(),
    updatedAt: new Date(),
  };

  const result = await getCategory().updateOne(
    { _id: new ObjectId(id) },
    { $set: updateField },
  );

  if (result.matchedCount === 0) {
    throw new ApiError(404, "Category not found");
  }

  const updatedCategory = await getCategory().findOne({
    _id: new ObjectId(id),
  });

  return res.status(200).json({
    success: true,
    message: "Category updated successfully!",
    data: updatedCategory,
  });
});

// delete category;
export const deleteCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid MongoDB Object format");
  }
  const categoryId = new ObjectId(id);
  const category = await getCategory().findOne({
    _id: categoryId,
  });

  if (!category) {
    throw new ApiError(404, "Category not found")
  }
  const product = await getCollection().findOne({ categoryId: categoryId });
  if (product) {
    throw new ApiError(400, "Cannot delete category because products exist in this category")
  }
  await getCategory().deleteOne({
    _id: categoryId,
  });
  res.status(200).json({
    success: true,
    message: "Category deleted successfully!",
  });
});
