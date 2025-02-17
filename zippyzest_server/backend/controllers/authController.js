const Usermodel = require('../models/user')
const jwt =  require('jsonwebtoken')
const sentOtp = async(req,res) => {
  const  {mobileNumber} = req.body;
  const otp = Math.floor(1000 + Math.random() * 9000).toString();
  console.log(otp);
  const otpExpires = Date.now() + 3600000; // OTP expires in 1 hour
    try {
        console.log(req.body);
        if (!mobileNumber) {
          return res.status(400).send({
              success : false,
             message: "Mobile Number is required." });
        } 
        const user = await Usermodel.findOne({ mobileNumber :mobileNumber });
        if (user) {
          user.otp = otp;
          user.otpExpires = otpExpires;
        }
        const token = jwt.sign({ mobileNumber, otp, otpExpires }, process.env.SECRET_KEY_JWT, { expiresIn: "10m" });
      
    
        res.cookie('token', token, {
          httpOnly: true,
          secure: true, // Set to 'true' in production
          sameSite: 'None', // Adjust as necessary
          maxAge: 3600000 // 1 hour
        });
    
        res.status(200).send({
          success : true,
           message: `OTP sent.`, otp
          }); // Remove OTP in production
      } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error." });
      }


}
const VerifyOtp = async (req, res) => {
  try {
    const { otp } = req.body;
    const token = req.cookies.token;
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

    if (decoded.otp === otp && decoded.otpExpires > Date.now()) {
      // Check if the user already exists
      let user = await Usermodel.findOne({ mobileNumber: decoded.mobileNumber });

      if (user) {
        // If user exists, update the existing user document
        user.otp = decoded.otp;
        user.otpExpires = decoded.otpExpires;
      } else {
        // If user does not exist, create a new user document
        user = new Usermodel({
          mobileNumber: decoded.mobileNumber,
          otp: decoded.otp,
          otpExpires: decoded.otpExpires
        });
      }

      await user.save();

      // Generate a new token with the user details
      const newToken = jwt.sign(
        { id: user._id, mobileNumber: user.mobileNumber },
        process.env.SECRET_KEY_JWT,
        { expiresIn: "120m" }
      );

      // Set the new token as a cookie
      res.cookie('token', newToken, {
        httpOnly: true,
        secure: true, // Set to 'true' in production
        sameSite: 'None', // Adjust as necessary
        maxAge: 3600000 // 1 hour // 10 minutes
      });
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
// Adjust the path according to your project structure
const updateUser = async (req, res) => {
  try {
    const { mobileNumber, username, email } = req.body;
    console.log(
      req.body
    );
    

    // Validate input
    if (!mobileNumber) {
      return res.status(400).json({
        success: false,
        message: 'Mobile number is required.'
      });
    }

    // Find the user by mobileNumber
    const user = await Usermodel.findOne({ mobileNumber });
    console.log(user);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.'
      });
    }

    // Update the user fields if they are provided
    if (username) user.username = username;
    if (email) user.email = email;

    // Save the updated user
    await user.save();

    res.status(200).json({
      success: true,
      message: 'User updated successfully.',
      user
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Internal server error.'
    });
  }
};
const logout = (req, res) => {
  res.clearCookie('token'); // Clear seller token cookie
  if (!req.cookies.token) {
    return res.status(400).json({
      success: false,
      message: "No  token found"
    });
  }
  res.status(200).json({
    success: true,
    message: "User logged out successfully"
  });
};
const alluser = async(req,res) => {
  try {
    const user = await Usermodel.find({})
    if(!user){
      return res.status(404).send({success:false,message:"No user found"})
    }
    res.status(200).send({
      success:true,
      message:"All user found",
      user
    })
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Internal server error"
    })
  }
}
const getuser = async(req,res) => {
  try {
    const userId = req.user.id
    const user = await Usermodel.findById(userId)
    if (!user) {
      return res.status(404).send({ success: false, message: 'User not found' });
    }

    res.status(200).send({ success: true, user });
  } catch (error) {
    console.error(error);
    res.status(500).send({ success: false, message: 'Failed to get user details' });
  }
}
const getAuth = async(req,res) => {
  try {
    res.status(200).json({
      success: true,
      message: 'User is authenticated',
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: 'Failed to retrieve orders'
    });
  }
}
const getadmin = async(req,res) => {
  try {
    res.send({
      success: true,
      message: "Welcome to the admin dashboard",
      user: req.user
    });
  } catch (error) {
    console.log(error);
    
  }
}
module.exports = {
    sentOtp , VerifyOtp ,logout,alluser,getuser,getAuth,updateUser,getadmin
}