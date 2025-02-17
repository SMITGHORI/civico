const Cart = require('../models/cart')
const CartItems = require('../models/cartItem')
const Product = require('../models/product')
// const addcart = async(req,res) => {
//   try {
//     const userId = req.user.id
//     const {productId,quantity,price} = req.body
//     console.log(req.body);
    
//     let cart = await Cart.findOne({userId}).populate('cartitems');
    
//     if(!cart) {
//         cart = new Cart({userId,cartitems:[]})
//     }
//     console.log(cart);
//     const existingItem = await cart.cartitems.find((item)=> {
//         console.log(item.productId);
        
//         return item.productId == productId
//     })
//     if(existingItem) {
//         existingItem.quantity += quantity
//         existingItem.price = price
//     } else {
//         const cartItem = await new CartItems({productId,quantity,price})
//         await cartItem.save();
//         await cartItem.populate('productId')
//         cart.cartitems.push(cartItem)
//     }
//     cart.totalPrice = cart.cartitems.reduce((acc,item)=> acc + item.price * item.quantity,0)
//     await cart.save()
//     console.log(cart);
    
//     res.status(201).send({
//         success : true,
//         message:'Item added to cart',
//         cart
//     })
// } catch (error) {
//     console.log(error);
//     res.status(500).send({
//         success: false,
//         message: 'Failed to add item to cart',
//     })
// }
// }
const addcart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId, quantity, price } = req.body;

    let cart = await Cart.findOne({ userId }).populate('cartitems');

    if (!cart) {
      cart = new Cart({ userId, cartitems: [] });
    }

    // Check if the product already exists in the cart
    const existingItem = cart.cartitems.find(
      item => item.productId.toString() === productId
    );

    if (existingItem) {
      // Update quantity of the existing item
      existingItem.quantity += quantity;
      console.log(existingItem.quantity);
      await existingItem.save()
    } else {
      // Add new item to the cart
      const cartItem = new CartItems({ productId, quantity, price });
      await cartItem.save();
      await cartItem.populate('productId');
      cart.cartitems.push(cartItem);
    }
  //  console.log(existingItem);
    
    // Recalculate totalPrice for the cart
    cart.totalPrice = cart.cartitems.reduce(
      (acc, item) => acc + item.quantity * item.price, // Multiply unit price by quantity
      0
    );

    await cart.save();
console.log(cart);

    res.status(201).send({
      success: true,
      message: 'Item added to cart',
      cart,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: 'Failed to add item to cart',
    });
  }
};
const getcart = async (req, res) => {
    try {
        const userId = req.user.id;

        // Find the user's cart and populate cartitems and product details
        let cart = await Cart.findOne({ userId })
            .populate({
                path: 'cartitems',
                populate: {
                    path: 'productId',
                    model: 'Product', // Ensure this matches your Product model name
                    select: 'name price category image productQuantity productDiscountPrice' // Adjust fields based on what you need
                }
            });

        if (!cart) {
            return res.status(404).send({
                success: false,
                message: 'Cart not found',
            });
        }

        res.status(200).send({
            success: true,
            message: 'Cart retrieved successfully',
            cart
        });
    } catch (error) {
        console.error('Error retrieving cart:', error);
        res.status(500).send({
            success: false,
            message: 'Failed to retrieve cart',
        });
    }
};
const deletecart = async(req,res) => {
    try {
        const userId = req.user.id;
        const id = req.query.id;
        let cart = await Cart.findOne({ userId }).populate('cartitems');

        if (!cart) {
            return res.status(404).send({
                success: false,
                message: 'Cart not found',
            });
        }
        const itemIndex = cart.cartitems.findIndex(item => item._id.toString() === id);

        if (itemIndex === -1) {
            return res.status(404).send({
                success: false,
                message: 'Item not found in cart',
            });
        }

        cart.cartitems.splice(itemIndex, 1);
        cart.totalPrice = cart.cartitems.reduce((acc, item) => acc + item.price * item.quantity, 0);
        await cart.save();

        // Optionally, delete the CartItem document if you want to clean up
        // await CartItems.findByIdAndDelete(itemId);

        res.status(200).send({
            success: true,
            message: 'Item removed from cart',
            cart,
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            success: false,
            message: 'Failed to remove item from cart',
        });
    }
}
const updatecart = async(req,res) => {
    try {
        const userId = req.user.id;
        const id = req.query.id;
        const { quantity } = req.body;

        // Validate quantity
        if (quantity <= 0) {
            return res.status(400).send({
                success: false,
                message: 'Quantity must be greater than 0',
            });
        }

        // Find the user's cart and populate the cartitems
        let cart = await Cart.findOne({ userId }).populate('cartitems');

        if (!cart) {
            return res.status(404).send({
                success: false,
                message: 'Cart not found',
            });
        }

        // Find the item in the cart
        const existingItem = cart.cartitems.find(item => item._id.toString() === id);

        if (!existingItem) {
            return res.status(404).send({
                success: false,
                message: 'Item not found in cart',
            });
        }

        // Update the quantity and price of the existing item
        existingItem.quantity = quantity;
        existingItem.price = req.body.price || existingItem.price; // Optionally update the price if provided
        await existingItem.save(); 
        // Update the total price of the cart
        cart.totalPrice = cart.cartitems.reduce((acc, item) => acc + item.price * item.quantity, 0);

        // Save the updated cart
        await cart.save();
        
        res.status(200).send({
            success: true,
            message: 'Cart item updated successfully',
            cart,
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            success: false,
            message: 'Failed to update cart item',
        });
    }
}
const sentOtp = async (req, res) => {
    const { mobileNumber } = req.body;
  
    try {
      if (!mobileNumber) {
        return res.status(400).send({
          success: false,
          message: "Mobile Number is required."
        });
      }
  
      // Prepare the verification data
      const verificationData = {
        To: `+91${mobileNumber}`,
        Channel: 'sms'
      };
  
      console.log('Sending request to Twilio with data:', verificationData);
  
      // Sending OTP request to Twilio
      const response = await axios.post(`https://verify.twilio.com/v2/Services/${verifyServiceSid}/Verifications`, verificationData, {
        auth: {
          username: accountsid,
          password:authtoken,
        },
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Accept': 'application/json',
        },
      });
  
      // Log the full response data for debugging
      console.log(response.data);
  
      // Check if the status is 'pending' after sending OTP
      if (response.data.status === 'pending') {
        // Create a token for the mobile number (you can customize the payload)
        const token = jwt.sign({ mobileNumber }, process.env.SECRET_KEY_JWT, { expiresIn: '10m' }); // Set an expiration time
  
        // Set the token as a cookie
        res.cookie('otp_token', token);
  
        return res.status(200).send({
          success: true,
          message: `OTP sent to ${mobileNumber}.`
        });
      } else {
        return res.status(500).send({
          success: false,
          message: "Failed to send OTP."
        });
      }
  
    } catch (error) {
      console.error('Error sending OTP:', error);
  
      // Check if the error response is available
      if (error.response) {
        return res.status(error.response.status).json({
          success: false,
          message: error.response.data.message || "Failed to send OTP."
        });
      }
  
      // Generic error response
      return res.status(500).json({ message: "Internal server error." });
    }
  };
  const VerifyOtp = async (req, res) => {
    const { otp } = req.body;
    const token = req.cookies.token;
  
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
    
    try {
      if (!decoded.mobileNumber || !otp) {
        return res.status(400).json({
          success: false,
          message: "Mobile Number and OTP are required."
        });
      }
      const verificationData = {
        To: `+91${decoded.mobileNumber}`,
        Channel: 'sms'
      };
      const response = await axios.post(`https://verify.twilio.com/v2/Services/${verifyServiceSid}/VerificationCheck`, verificationData, {
        auth: {
          username:accountsid,
          password:authtoken,
        },
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded', // Set content type
          'Accept': 'application/json', // Specify the expected response format
        },
      });
  
      if (response.data.status === 'approved') {
       let mobileNumber = decoded.mobileNumber
        // OTP is valid, proceed with user registration or login logic
        let user = await Usermodel.findOne({ mobileNumber });
  
        if (user) {
          // If user exists, update the existing user document
          user.otp = otp;
          user.otpExpires = Date.now() + 3600000; // Update expiration
        } else {
          // If user does not exist, create a new user document
          user = new Usermodel({
            mobileNumber,
            otp,
            otpExpires: Date.now() + 3600000
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
          secure: process.env.NODE_ENV === 'production',
          maxAge: 2 * 60 * 60 * 1000 // 2 hours
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
      console.error('Error verifying OTP:', error);
      res.status(500).json({ message: "Internal server error." });
    }
  };
module.exports = {addcart,getcart,deletecart,updatecart}