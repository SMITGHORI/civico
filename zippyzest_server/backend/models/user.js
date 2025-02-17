const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
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
    username : {
      type: String,
      required: false
    },
    email : {
      type: String,
      required: false
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user'
    },  
    createdAt: {
      type: Date,
      default: Date.now
    }
  }, {
    timestamps: true
  });
module.exports = mongoose.model('User', userSchema);
