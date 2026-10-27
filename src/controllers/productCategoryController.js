
import { ObjectId } from "mongodb";
import { getDB } from "../config/db.js";

export const getCollection = () => {
  return getDB().collection("products");
};
const getCategory = () => getDB().collection("category");

// createa category;
export const createCategory = async (req, res) => {
  try {
    const { category } = req.body;

    if (!category || typeof category !== "string") {
      return res.status(400).json({
        success: false,
        message: "Provide the Category Name",
      });
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
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// get all category;
export const getCategorys = async(req, res)=>{
  try {
    const categorys = await getCategory().find({}).toArray();
     res.status(200).json({
      success: true, 
      categoryCount : categorys.length,
      data: categorys
     })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

// get category by id;
export const getCategoryByID = async (req, res)=>{
  try {
    const {id} = req.params;

    if(!ObjectId.isValid(id)){
      return res.status(400).json({
        success: false,
        message: 'Invalid MongoDB object formate'
      })
    }
    const category = await getCategory().findOne({_id: new ObjectId(id)})
    if(!category){
      return res.status(404).json({
        success: false,
        message: 'category not found!'
      })
    }
    res.status(200).json({
      success: true ,
      message: category
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

// update category;
export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { category } = req.body;


    if (!ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid MongoDB ObjectId format",
      });
    }

    if (typeof category !== "string") {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid category name",
      });
    }

    const updateField = {
      category: category.trim(),
      updatedAt: new Date(),
    };

    const result = await getCategory().updateOne(
      { _id: new ObjectId(id) },
      { $set: updateField }
    );


    if (result.matchedCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Category not found!",
      });
    }

    const updatedCategory = await getCategory().findOne({
      _id: new ObjectId(id),
    });

    return res.status(200).json({
      success: true,
      message: "Category updated successfully!",
      data: updatedCategory,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// delete category;
export const deleteCategory = async(req, res)=>{
  try {
    const {id} = req.params;

    if(!ObjectId.isValid(id)){
      return res.status(400).json({
        success: false,
        message: 'Invalid category ID'
      })
    }
    const categoryId = new ObjectId(id);
    const category = await getCategory().findOne({
      _id: categoryId,
    })

    if(!category){
      return res.status(404).json({
        success: false, 
        message: 'Category not found'
      })
    }
    const product = await getCollection().findOne(
      {categoryId: categoryId}
    )
    if(product){
      return res.status(400).json({
        success: false, 
        message: 'Cannot delete category because products exist in this category'
      })
    }
    await getCategory().deleteOne({
      _id: categoryId,
    })
    res.status(200).json({
      success: true,
      message: 'Category deleted successfully!'
    })
  } catch (error) {
    res.status(500).json({
      success: false, 
      message: error.message,
    })
  }
}