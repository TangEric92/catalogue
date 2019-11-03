const mongoose = require("mongoose");

const Product = mongoose.model("Product", {
  title: { type: String },
  description: { type: String },
  price: { type: Number },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category"
  },
  reviews: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Review"
    }
  ],
  averageRating: {
    type: Number,
    min: 0,
    max: 5
  }
});

module.exports = Product;
