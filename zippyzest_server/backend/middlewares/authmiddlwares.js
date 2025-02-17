const jwt = require('jsonwebtoken');
const Seller = require('../models/seller');
const seller = require('../models/seller');
const User = require('../models/user')
const isLoggedIn = (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token){
      return res.status(401).json({ 
        success: false, 
        message: "You need to log in to access this resource." 
      });
    }
    const decoded = jwt.verify(token, process.env.SECRET_KEY_JWT);
    req.user = decoded;
    next();
  } catch (error) {
    console.error("Authentication error:", error);
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token. Please log in again."
    });
  }
};
const preventReLogin = (req, res, next) => {
    const token = req.cookies.token;
    if (token) {
      try {
        jwt.verify(token, process.env.SECRET_KEY_JWT);
        return res.status(400).json({
          success: false,
          message: "You are already logged in."
        });
      } catch (error) {
        // Token is invalid or expired, proceed to login
        next();
      }
    } else {
      next();
    }
};
const IsSeller = async(req,res,next) => {
  try {
    const token = req.cookies.maintoken;
    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: "You need to log in to access this resource."
      })
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.SECRET_KEY_JWT);
    
    
    // Fetch the seller from the Seller schema using the decoded ID
    const seller = await Seller.findById(decoded.id);

    
    
    if (!seller) {
      return res.status(401).json({ 
        success: false, 
        message: "Seller not found. Please log in again." 
      });
    }

    // Attach the seller to the request object for further use in routes
    req.user = seller;
    next();
  } catch (error) {
    console.error("Authentication error:", error);
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token. Please log in again."
    });
  }
}
const ISUser = async(req,res,next) => {
  try {
    const token = req.cookies.token;  
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "You need to log in to access this resource."
        })
    }
    const decoded = jwt.verify(token, process.env.SECRET_KEY_JWT);
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({
        success: false,
        message : 'User not found. Please log in again.'
        })
    }
    req.user = user;
    next();
  }
  catch(error) {
    console.log(error);
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token. Please log in again."
    });
  }


}
const verifyOtpInitiation = (req, res, next) => {
  const token = req.cookies.verifytoken; // Assuming you set a 'verifytoken' cookie after OTP is sent
  if (!token) {
    return res.status(403).send({ success: false, message: "Please enter your mobile number first." });
  }
  next();
};
const checkOtpVerified = async (req, res, next) => {
  try {
    const token = req.cookies.sellertoken;

    if (!token) {
      return res.status(401).json({ success: false, message: "Unauthorized: No token provided." });
    }

    // Decode the token
    const decoded = jwt.verify(token, process.env.SECRET_KEY_JWT);

    // Check if OTP is verified from the decoded token
    if (!decoded.otpVerified) {
      return res.status(403).json({ success: false, message: 'OTP not verified. Please verify OTP first.' });
    }

    // Optionally, fetch user from the database if needed
    const user = await seller.findById(decoded.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    req.user = user; // Attach the user to the request object if needed
    next(); // Proceed to the next middleware/route handler
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};
const Isadmin = async(req,res,next) => {
  try {
    const token = req.cookies.token;  
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "You need to log in to access this resource."
        })
    }
    const decoded = jwt.verify(token, process.env.SECRET_KEY_JWT);
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({
        success: false,
        message : 'User not found. Please log in again.'
        })
    }

    if (user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admins only."
      });
    }

    // Attach user to the request object
    req.user = user;

    // Continue to the next middleware or route
    next();
  }
  catch(error) {
    console.log(error);
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token. Please log in again."
    });
  }
}



module.exports ={isLoggedIn,preventReLogin,IsSeller,verifyOtpInitiation,checkOtpVerified,ISUser,Isadmin};