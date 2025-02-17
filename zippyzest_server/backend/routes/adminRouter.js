const express = require('express')
const { VerifyOtp, sentOtp, logout, getOrdersForSeller, getAuth, setUsernamePassword, SellerLogin ,getorderdetails, Totalsellers} = require('../controllers/adminController')
const { preventReLogin, IsSeller, verifyOtpInitiation, checkOtpVerified } = require('../middlewares/authmiddlwares')
const router = express.Router()
router.post('/signup/sent-otp',preventReLogin,sentOtp)
router.post('/signup/verify-otp',verifyOtpInitiation,VerifyOtp)
router.post('/signup/setcrediantals',checkOtpVerified,setUsernamePassword),
router.post('/login',SellerLogin)
router.get('/logout',logout)
router.get('/getorderforseller',IsSeller,getOrdersForSeller)
router.get('/getorderdetails',getorderdetails)
router.get('/check-auth',IsSeller,getAuth)
router.get('/Totalsellers',Totalsellers)
module.exports = router