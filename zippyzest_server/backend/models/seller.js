const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const sellerSchema = new Schema({
    mobileNumber: {
      type: String,
      required: true,
    },
    otp: {
      type: String,
      required: true
    },
    otpExpires: {
      type: Date,
      required: true
    },
    otpVerified: { type: Boolean, default: false ,required:true}, 
    username : {
      type: String,
      required: false
    },
    password : {
      type: String,
      required: false
    }
  }, {
    timestamps: true
  });
module.exports = mongoose.model('seller', sellerSchema);
