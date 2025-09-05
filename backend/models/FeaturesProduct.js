// models/FeaturedProduct.js
const mongoose = require('mongoose');

const featuredProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    images: [{ type: String }], // array of image URLs
    category: { type: String },
    tags: [{ type: String }],
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('FeaturedProduct', featuredProductSchema);
