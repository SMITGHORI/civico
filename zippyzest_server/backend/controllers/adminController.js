const sellerModel = require('../models/seller')
const Order =  require('../models/order')
const jwt = require('jsonwebtoken');
const sentOtp = async(req,res) => {
    const  {mobileNumber} = req.body;
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    console.log(otp);
    const otpExpires = Date.now() + 3600000; // OTP expires in 1 hour
      try {
          
          console.log(req.body);
          
          if (!mobileNumber) {
            return res.status(400).send({ success : false,message: "Mobile Number is required." });
          } 
          const user = await sellerModel.findOne({ mobileNumber :mobileNumber });
          if (user) {
            return res.status(400).send({ success : false,message: "User already exists." });
          }
          const token = jwt.sign({ mobileNumber, otp, otpExpires }, process.env.SECRET_KEY_JWT, { expiresIn: "10m" });
          console.log(token);
      
          res.cookie('verifytoken', token, {
            httpOnly: true,
            secure: true, // Set to 'true' in production
            sameSite: 'None', // Adjust as necessary
            maxAge: 3600000 // 1 hour
          });
      
          res.status(200).send({success : true, message: `OTP sent.`, otp, token }); // Remove OTP in production
        } catch (error) {
          console.log(error);
          return res.status(500).json({ message: "Internal server error." });
        }
  }
const VerifyOtp = async (req, res) => {
    try {
      const { otp } = req.body;
      const token = req.cookies.verifytoken;
      console.log(token);
      
  
      if (!token) {
        return res.status(400).send({ 
          success: false,
          message: "Token is required."
        });
      }
  
      if (!otp) {
        return res.status(400).json({
          success: false,
          message: "OTP is required."
        });
      }
  
      const decoded = jwt.verify(token, process.env.SECRET_KEY_JWT);
  console.log(decoded);
  
      if (decoded.otp === otp && decoded.otpExpires > Date.now()) {
        // Check if the user already exists
        let user = await sellerModel.findOne({ mobileNumber: decoded.mobileNumber });
  
        if (user) {
          // If user exists, update the existing user document
          user.otp = decoded.otp;
          user.otpExpires = decoded.otpExpires;
          user.otpVerified = true; 
        } else {
          // If user does not exist, create a new user document
          user = new sellerModel({
            mobileNumber: decoded.mobileNumber,
            otp: decoded.otp,
            otpExpires: decoded.otpExpires,
            otpVerified: true 
          });
        }
  
        await user.save();
  
        // Generate a new token with the user details
        const newToken = jwt.sign(
          { id: user._id, mobileNumber: user.mobileNumber,otpVerified : user.otpVerified },
          process.env.SECRET_KEY_JWT,
          { expiresIn: "60m" }
        );
      
        // Set the new token as a cookie
        res.cookie('sellertoken', newToken),{
          httpOnly: true,
            secure: true, // Set to 'true' in production
            sameSite: 'None', // Adjust as necessary
            maxAge: 3600000 // 1 hour
        };
        res.status(200).send({
          success: true,
          message: "OTP verified and user registered/updated successfully.",
          user
        });
      } else {
        res.status(400).send({
          success: false,
          message: "Invalid OTP or OTP expired."
        });
      }
    } catch (error) {
      console.error(error);
      res.status(400).send({
        success: false,
        message: "Invalid or expired token."
      });
    }
  };
const bcrypt = require('bcrypt');
const setUsernamePassword = async (req, res) => {
  try {
    const { username, password } = req.body;
    const token = req.cookies.sellertoken;

    if (!token) {
      return res.status(400).send({
        success: false,
        message: "Token is required."
      });
    }
    const usernameuser = await sellerModel.findOne({username})
    if(usernameuser) {
      return res.status(400).send({
        success: false,
        message: "Username already exists."
      })
    }
    const decoded = jwt.verify(token, process.env.SECRET_KEY_JWT);

    // Check if the user exists
    const user = await sellerModel.findOne({ mobileNumber: decoded.mobileNumber });
    if (!user) {
      return res.status(400).send({
        success: false,
        message: "User not found."
      });
    }

    // Hash the password using bcrypt
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Update the user's username and password
    user.username = username;
    user.password = hashedPassword;

    await user.save();

    res.status(200).send({
      success: true,
      message: "Username and password set successfully.",
      user
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "Internal server error."
    });
  }
};
const SellerLogin = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if username and password are provided
    if (!username || !password) {
      return res.status(400).send({
        success: false,
        message: "Username and password are required."
      });
    }

    // Find the seller by username
    const seller = await sellerModel.findOne({ username });
    if (!seller) {
      return res.status(400).send({
        success: false,
        message: "Seller not found."
      });
    }

    // Compare the entered password with the hashed password in the database
    const isMatch = await bcrypt.compare(password, seller.password);
    if (!isMatch) {
      return res.status(400).send({
        success: false,
        message: "Invalid credentials."
      });
    }

    // Generate a JWT token if the login is successful
    const token = jwt.sign(
      { id: seller._id, username: seller.username },
      process.env.SECRET_KEY_JWT,
      { expiresIn: "1h" } // Token expires in 1 hour
    );

    // Send the token as a cookie
    res.cookie('maintoken', token, {
      httpOnly: true,
      secure: true, // Set to 'true' in production
      sameSite: 'None', // Adjust as necessary
      maxAge: 3600000 // 1 hour
    });

    // Send the response
    res.status(200).send({
      success: true,
      message: "Login successful",
      token
    });

  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "Internal server error."
    });
  }
};
const logout = (req, res) => {
  res.clearCookie('maintoken'); // Clear seller token cookie
  if (!req.cookies.sellertoken) {
    return res.status(400).json({
      success: false,
      message: "No seller token found"
    });
  }
  res.status(200).json({
    success: true,
    message: "Seller logged out successfully"
  });
  };
const getOrdersForSeller = async (req, res) => {
    try {
      const sellerId = req.user.id; // Assuming the seller is logged in, and you are getting their ID from `req.user`
  
      // Find all orders where any item has the sellerId matching the logged-in seller
      const orders = await Order.find({ 'items.sellerId': sellerId })
        .populate('items.product') // Populate product details if needed
        .populate('user', 'name email'); // Optionally, populate the user details (name, email, etc.)
  
      if (orders.length === 0) {
        return res.status(404).send({
          success: false,
          message: 'No orders found for this seller'
        });
      }
  
      res.status(200).send({
        success: true,
        message: 'Orders retrieved successfully',
        orders
      });
    } catch (error) {
      console.error(error);
      res.status(500).send({
        success: false,
        message: 'Failed to retrieve orders'
      });
    }
};
const getAuth = async(req,res) => {
  try {
    res.status(200).json({
      success: true,
      message: 'Seller is authenticated',
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: 'Failed to retrieve orders'
    });
  }
}
const getorderdetails = async(req,res) => {
  try {
    const  orderId  = req.query.id
    
    // Find the order by ID
    const order = await Order.findById(orderId).populate('items.product').populate('user'); // Assuming you are populating the 'product' field in 'items'

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    return res.status(200).json({ success: true, order });
  } catch (error) {
    console.error("Error fetching order:", error);
    return res.stat
}
}
const Totalsellers = async(req,res) => {
  try {
    const seller = await sellerModel.find({})
    if(!seller){
      return res.status(404).send({success:false,message:"No seller found"})
    }
    res.status(200).send({
      success:true,
      message:"All seller found",
      seller
    })
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Internal server error"
    })
  }
}
const Forgotpass = async(req,res) => {

}
module.exports = {
    sentOtp,VerifyOtp,logout,getOrdersForSeller,getAuth,setUsernamePassword,SellerLogin,getorderdetails,Totalsellers
}


/*
{
    "shippingAddress" : {
                "addressLine1": "home",
                "addressLine2":"home",
                "city": "surat",
                "state": "gujarat",
                "postalCode": "395004",
                "country": "india"
    },
    "paymentMethod" : "Bank Transfer",
    "isCOD": false
}
    */