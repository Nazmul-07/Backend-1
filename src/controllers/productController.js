
import { ObjectId } from "mongodb";
import { getDB } from "../config/db.js";

// Get products collection
export const getCollection = () => {
  return getDB().collection("products");
};

// POST: Create a new product
export const createProduct = async (req, res) => {
  try {
    const {name, category, price, stock} = req.body;

    // Check empty request body
    if (!name || price === undefined || !category) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields (name, price, category)",
      });
    }
    const newProduct = {
      name: String(name).trim(),
      price: Number(price),
      category: String(category).trim(),
      stock: stock !== undefined ? Boolean(stock): true,
      createdAt : new Date(),
    }

    const result = await getCollection().insertOne(newProduct);

    res.status(201).json({
      success: true,
      message: "Product created successfully!",
      data: {
        _id: result.insertedId,
        ...newProduct,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
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

// GET: Get product by ID
export const getProductById =async (req, res)=>{
  try {
    const {id} = req.params;

    if(!ObjectId.isValid(id)){
      return res.status(400).json({
        success: false,
        message: "Invalid MongoDB Object format"
      })
    }
    const product = await getCollection().findOne({_id: new ObjectId(id)});
    if(!product){
      return res.status(404).json({
        success: false,
        message: "Product not found",
      })
    }
    res.status(200).json({
      success: true ,
      data: product,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

// PUT: Update a product by ID
export const updateProduct = async (req, res)=>{
  try {
    const {id} = req.params;
    if(!ObjectId.isValid(id)){
      return res.status(400).json({
        success: false,
        message: "Invalid MongoDB ObjectId format"
      })
    }
    const updateFields = {
      ...req.body,
      updatedAt : new Date(),
    }

    if(updateFields.price !== undefined){
      updateFields.price = Number(updateFields.price);
    }

    const result =await getCollection().updateOne(
      {_id: new ObjectId(id)},
      {$set: updateFields}
    )
    if(result.length === 0){
      return res.status(404).json({
        success: false,
        message: "Product not found",
      })
    }
    const updatedProduct = await getCollection().findOne({_id: new ObjectId(id)});
    
    res.status(200).json({
      success: true,
      message: "Product updated successfully!",
      data: updatedProduct,
    })

  } catch (error) {
    res.status(500).json({success: false, message: error.message})
  }
}

// PATCH: Delete a product by ID
export const deleteProduct = async (req, res)=>{
  try {
    const {id} = req.params;

  if(!ObjectId.isValid(id)){
    return res.status(400).json({
      success: false,
      message: "Invalid MongoDB ObjectId format",
    })
  }
  const result = await getCollection().deleteOne({
    _id: new ObjectId(id),
  })
  if(result.length === 0){
    return res.status(404).json({
      success: false,
      message: 'Product not found'
    })
  }
  res.status(200).json({
    success: true,
    message: 'Product deleted successfully'
  })

  } catch (error) {
    res.status(500).json({
      success:false,
      message: error.message,
    })
  }
}