const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/catalogue", { useNewUrlParser: true });

const Department = mongoose.model("Department", { title: { type: String } });

const Category = mongoose.model("Category", {
  title: { type: String },
  description: { type: String },
  Department: { type: mongoose.Schema.Types.ObjectId, ref: "Department" }
});

const Product = mongoose.model("Product", {
  title: { type: String },
  description: { type: String },
  price: { type: Number },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category"
  }
});

module.exports = Department;
module.exports = Category;
module.exports = Product;
