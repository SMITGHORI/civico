const Category = require('../models/category')
const Subcategory = require('../models/subcategory')
const Product = require('../models/product')
const path = require('path')
const fs = require('fs')
const cloudinary = require('cloudinary').v2;
const getPublicIdFromUrl = (url) => {
    const regex = /\/(?:v\d+\/)?([^\/]+)\/([^\/]+)\.[a-z]+$/;
    const match = url.match(regex);
    if (match) {
      return `${match[1]}/${match[2]}`; // captures the folder and file name without versioning or extension
    }
    return null;
};
const createCategory = async(req,res) => {
    try {
        const image = req.file ? req.file.path : null
         const sellerId = req.user.id
         
        const {name,description} = req.body
        const existingCategory = await Category.findOne({ slug : name });
        if (existingCategory) {
            return res.status(400).send({
                success: false,
                message: 'Category name already exists'
            });
        }
        let category = new Category({sellerId,name,description,image})
    
        
        category = await category.save()
        if(!category){
            return res.status(400).send({
                sucees : false,
                message:"Category not created"
            })
        }
        res.status(201).send({
            success : true,
            message : "Category created successfully",
            category
        })
    } catch (err) {
        console.log(err)
        res.status(500).send({
            success : false,
            message : err
        })
    }
}
const deleteCategory = async(req,res) => {
    try {
        const deleteId = req.query.id
        console.log(deleteId);
        const categorydelte =  await Category.findById(deleteId)
        if(!categorydelte){
            return res.status(400).send({
                success : false,
                message : "Category not found"
            })
        }
        const imagePath = categorydelte.image;
    if (imagePath) {
      const publicId = getPublicIdFromUrl(imagePath); 
      if (publicId) {
        const result = await cloudinary.uploader.destroy(publicId);
        console.log("Cloudinary deletion result:", result);
      } else {
        console.log("Could not extract publicId from image URL:", imagePath);
      }
    }
 await Category.findByIdAndDelete(deleteId)
    return res.status(200).send({
      success: true,
      message: "Category and image deleted successfully",
      categorydelte,
    });
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success : false,
            message : error
        })
    }
}
const updateCategory = async (req, res) => {
    try {
      const { name, description } = req.body;
      const updateId = req.query.id;
  
      // Find the existing category to check for current image
      let category = await Category.findById(updateId);
      if (!category) {
        return res.status(404).send({
          success: false,
          message: "Category not found",
        });
      }
  
      // If a new image is uploaded, update the image and delete the old one
      let image = category.image; // keep the old image by default
      if (req.file) {
        if (image) {
          const publicId = getPublicIdFromUrl(image);
          if (publicId) {
            const result = await cloudinary.uploader.destroy(publicId);
          } else {
            console.log("Could not extract publicId from URL:", image);
          }
        }
  
        image = req.file.path;
  
         // Update with the new image
      }
  
      // Update the category with or without image
      let categoryupdate = await Category.findByIdAndUpdate(
        updateId,
        {
          name: name,
          description: description,
          slug: name,
          image: image,
        },
        { new: true } // To return the updated category
      );
  
      if (!categoryupdate) {
        return res.status(400).send({
          success: false,
          message: "Category not updated",
        });
      }
  
      return res.status(200).send({
        success: true,
        message: "Category updated successfully",
        categoryupdate,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        message: error.message || "Server error",
      });
    }
};
const allCategory = async(req,res) => {
    try {
        const category = await Category.find({})
        if(!category){
            return res.status(400).send({
                success : false,
                message : "Category not found"
            })
        }
        return res.status(200).send({
            success : true,
            message : "Category found",
            category
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success : false,
            message : error
        })
    }
}
const SellerCategoryFind = async(req,res) => {
  try {
    const sellerId = req.user.id;  // Assuming seller ID is available in req.user
    
    // Find categories added by this seller
    const categories = await Category.find({ sellerId });
    
    if (!categories || categories.length === 0) {
        return res.status(400).send({
            success: false,
            message: "No categories found for this seller"
        });
    }

    // Optionally, find products for each category created by this selle

    return res.status(200).send({
        success: true,
        message: "Categories found for this seller",
        categories,
    });
} catch (error) {
    console.log(error);
    res.status(500).send({
        success: false,
        message: "Server error"
    });
}
}
const getproductfromcategory = async(req,res) => {
  try {
    const categoryId = req.query.id || req.body.categoryId
    console.log(categoryId);
    
    const subcategory = await Subcategory.find({categoryId: categoryId}).populate('categoryId')
    if (!subcategory || subcategory.length === 0) {
      return res.status(400).send({
        success: false,
        message: "No subcategory found for this category"
        });
    }
    return res.status(200).send({
      success: true,
      message: "subcategory found for this category",
      subcategory
      });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Server error"
      });
  }
}
const getcategory = async(req,res) => {
    try {
        const categoryname = req.query.slug
        let category = await Category.findOne({slug : categoryname })
        if(!category){
            return res.status(400).send({
                success : false,
                message : "Category not found"
            })
        }
        return res.status(200).send({
            success : true, 
            message : "Category found",
            category
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success : false,
            message : error
        })
    }
}
module.exports = {
    createCategory,deleteCategory,updateCategory,allCategory,getcategory,SellerCategoryFind,getproductfromcategory
}