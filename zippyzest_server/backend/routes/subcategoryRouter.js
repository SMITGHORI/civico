const express = require('express')
const { IsSeller } = require('../middlewares/authmiddlwares')
const router = express.Router()
const multer = require('multer')
const crypto = require('crypto')
const path = require('path')

const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const { createsubcategory, SellersubCategoryFind, deltesubcategory, updatesubcategory } = require('../controllers/subcategoryController')

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'subcategory', // Folder in Cloudinary where images will be stored
    allowed_formats: ['jpg', 'png', 'jpeg'],
  },
});
const upload = multer({ storage: storage })
router.post('/create-subcategory',upload.single('image'),IsSeller,createsubcategory)
router.delete('/delete-subcategory',IsSeller,deltesubcategory)
router.post('/update-subcategory',upload.single('image'),IsSeller,updatesubcategory)
// router.get('/all-category',allCategory)
router.get('/getsellersubcategory',IsSeller,SellersubCategoryFind)
// router.get('/getcategory',getcategory)
// router.post('/getproductincategory',getproductfromcategory)
module.exports = router