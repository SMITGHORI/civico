const mongoose = require('mongoose');
const slugify = require('slugify');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    maxlength: 100
  },
  slug: {
    type: String,
    unique: true
  },
  description: {
    type: String,
    trim: true,
    maxlength: 500
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  subcategory:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SubCategory',
    required: true
  },
  image: {
    type: String, // Adjust as needed (can be false if image is optional)
  },
  sellerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'seller', // Reference to the Seller model
    required: true
  },
  productDiscountPrice: {
    type: Number,
    default: 0 // Optional discount price
  },
  productSize:{
    type: Array,
    default:[]
  },
  productThickness:{
    type: Array,
    default:[]
  },
  productUnit: {
    type: String,
    required: true
  },
  productQuantity: {
    type: Number,
    required: true
  },
  productweight:{
    type: String,
  },
  productColor:{
    type: Array,
  },
  productStock: {
    type: Number,
    required: true
  },
  productKeyFeatures: {
    type: String,
    required: false // Optional field
  },
  manufacturerDetails: {
    type: String,
    required: false // Optional field
  },
  returnPolicy: {
    type: String,
    required: false // Optional field
  },
  countryOfOrigin: {
    type: String,
    required: false // Optional field
  },
//   ratings: {
//     average: {
//       type: Number,
//       default: 0,
//       min: 0,
//       max: 5
//     },
//     count: {
//       type: Number,
//       default: 0
//     }
//   },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Pre-save hook to create a slug from the name
productSchema.pre('save', function (next) {
  if (this.isModified('name')) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
  next();
});

module.exports = mongoose.model('Product', productSchema);
