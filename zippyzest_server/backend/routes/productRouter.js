const express = require('express')
const { createProduct, delteProduct, allProduct, updateProduct, getProduct, SellerProductFind, getproductfromproduct, allProductByCategories, getproductbysubcategory } = require('../controllers/productController')
const {IsSeller} = require('../middlewares/authmiddlwares')
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
    folder: 'products', // Folder in Cloudinary where images will be stored
    allowed_formats: ['jpg', 'png', 'jpeg'],
  },
});
const upload = multer({ storage: storage })
router.post('/create-product',upload.single('image'),IsSeller,createProduct)
router.delete('/delete-product',IsSeller,delteProduct)
router.get('/all-product',allProduct)
router.put('/update-product',IsSeller,updateProduct)
router.get('/getproduct',IsSeller,getProduct)
router.get('/getsellerproduct',IsSeller,SellerProductFind)
router.post('/getproductfromproduct',getproductfromproduct)
router.get('/products',allProductByCategories)
router.post('/getproductbysubcategory',getproductbysubcategory)
module.exports = router