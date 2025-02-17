const express = require('express')
const { isLoggedIn } = require('../middlewares/authmiddlwares')
const { addcart, getcart, deletecart, updatecart } = require('../controllers/cartController')
const router = express.Router()
router.post('/addcart',isLoggedIn,addcart)
router.get('/getcart',isLoggedIn,getcart)
router.get('/deletecart',isLoggedIn,deletecart)
router.post('/updatecart',isLoggedIn,updatecart)
module.exports = router