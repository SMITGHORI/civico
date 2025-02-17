const Category = require('../models/category')
const Product = require('../models/product')
const Subcategory = require('../models/subcategory')
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
const createsubcategory = async(req,res) => {
    try {
        let category = req.body.category
        let cateogryfind = await Category.findById(category)
        if(!cateogryfind){
            return res.status(400).send({
                success : false,
                message : "Category not found"
            })
        }
        const image = req.file ? req.file.path : null;
        const sellerId = req.user.id
        const {name,description} = req.body
        const existingsubcategory = await Subcategory.findOne({ name });
        if (existingsubcategory) {
            return res.status(400).send({
                success: false,
                message: 'Subcategory name already exists'
            });
        }
        let subcategory = new Subcategory({
            sellerId,
            name:name,
            description : description,
            image :image,
            categoryId:category
        })
        subcategory = await subcategory.save()
        if(!subcategory) {
            return res.status(400).send({
                success : false,
                message : "subcategory not created"
            })
        }
        return res.status(200).send({
            success : true,
            message : "subcategory Created SuccesFully",
            subcategory
        })
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success : false,
            message : error
        })
    }
}
const deltesubcategory = async(req,res) => {
    try {
        const deleteId = req.query.id
        console.log(deleteId);
        const subcategorydelete =  await Subcategory.findById(deleteId)
        if(!subcategorydelete){
            return res.status(400).send({
                success : false,
                message : "subcategorydelete not deleted"
            })
        }
        const imagePath = subcategorydelete.image;
    if (imagePath) {
      const publicId = getPublicIdFromUrl(imagePath); 
      if (publicId) {
        const result = await cloudinary.uploader.destroy(publicId);
        console.log("Cloudinary deletion result:", result);
      } else {
        console.log("Could not extract publicId from image URL:", imagePath);
      }
    }
    await Subcategory.findByIdAndDelete(deleteId)
    return res.status(200).send({
      success: true,
      message: "Category and image deleted successfully",
      subcategorydelete,
    });
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success : false,
            message : error
        })
    }
}
const allsubcategory = async(req,res) => {
    try {
        const subcategory = await Subcategory.find({}).populate('category')
        if(!subcategory){
            return res.status(400).send({
                success : false,
                message : "subcategory not found"
            })
        }
        return res.status(200).send({
            success : true,
            message : "subcategory found",
            subcategory
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success : false,
            message : error
        })
    }
}
const updatesubcategory = async (req, res) => {
    try {
      const updateId = req.query.id;
      console.log(updateId);
      
      const {
        name,
        description,category
      } = req.body;
  console.log(req.body);
  
      // Find the existing product to check for the current image
      let subcategory = await Subcategory.findById(updateId);
      if (!subcategory) {
        return res.status(404).send({
          success: false,
          message: "subcategory not found",
        });
      }
  
      // Find the category
      let categoryFind = await Category.findById(category);
      if (!categoryFind) {
        return res.status(400).send({
          success: false,
          message: "Category not found",
        });
      }
  
      // If a new image is uploaded, update the image and delete the old one
      let image = subcategory.image; // Keep the old image by default
      if (req.file) {
        if (image) {
          const publicId = getPublicIdFromUrl(image);
          if (publicId) {
            const result = await cloudinary.uploader.destroy(publicId);
          } else {
            console.log("Could not extract publicId from URL:", image);
          }
        }
  
        image = req.file.path;// Update with the new image
      }
  
      // Update the product with the new data
      let subcategoryupdate = await Subcategory.findByIdAndUpdate(
        updateId,
        {
          name: name || subcategory.name,
          categoryId:category|| subcategory.categoryId,
          description: description || subcategory.description,
          image: image, // Update image only if a new one is uploaded
        },
        { new: true } // To return the updated product
      );
  
      if (!subcategoryupdate) {
        return res.status(400).send({
          success: false,
          message: "Product not updated",
        });
      }
  
      return res.status(200).send({
        success: true,
        message: "subcategoryupdate updated successfully",
        product: subcategoryupdate,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).send({
        success: false,
        message: error.message,
      });
    }
};
const SellersubCategoryFind = async(req,res) => {
  try {
    const sellerId = req.user.id;  // Assuming seller ID is available in req.user
    
    // Find categories added by this seller
    const subcategories = await Subcategory.find({ sellerId }).populate('categoryId');
    
    if (!subcategories || subcategories.length === 0) {
        return res.status(400).send({
            success: false,
            message: "No categories found for this seller"
        });
    }

    // Optionally, find products for each category created by this selle

    return res.status(200).send({
        success: true,
        message: "Categories found for this seller",
        subcategories,
    });
} catch (error) {
    console.log(error);
    res.status(500).send({
        success: false,
        message: "Server error"
    });
}
}
// const allProductByCategories = async (req, res) => {
//   try {
//     // Get all distinct categories from the products collection
//     const categories = await Product.distinct('category');

//     // Create an object to hold products grouped by category
//     const categoryProducts = {};

//     // Loop through each category and fetch products for that category, populating the category field
//     for (const category of categories) {
//       const products = await Product.find({ category }).populate('category', 'name'); // Populate category name
      
//       // Access category name through populated field
//       if (products.length > 0 && products[0].category && products[0].category.name) {
//         const categoryName = products[0].category.name;
//         categoryProducts[categoryName] = products; // Use category name as key instead of ID
//       }
//     }

//     res.status(200).json({
//       success: true,
//       categories: categoryProducts,  // Send the dynamically generated category-products object
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Error fetching products",
//     });
//   }
// };
module.exports = {
  createsubcategory,deltesubcategory,allsubcategory,updatesubcategory,SellersubCategoryFind
}