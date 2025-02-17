const express = require('express')
const { createCategory, deleteCategory, updateCategory, allCategory, getcategory, SellerCategoryFind, getproductfromcategory } = require('../controllers/categorycontroller')
const { IsSeller } = require('../middlewares/authmiddlwares')
const router = express.Router()
const multer = require('multer')
const crypto = require('crypto')
const path = require('path')

const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'category', // Folder in Cloudinary where images will be stored
    allowed_formats: ['jpg', 'png', 'jpeg'],
  },
});
const upload = multer({ storage: storage })
router.post('/create-category',upload.single('image'),IsSeller,createCategory)
router.delete('/delete-category',IsSeller,deleteCategory)
router.post('/update-category',upload.single('image'),IsSeller,updateCategory)
router.get('/all-category',allCategory)
router.get('/getsellercategory',IsSeller,SellerCategoryFind)
router.get('/getcategory',getcategory)
router.post('/getproductincategory',getproductfromcategory)
module.exports = router