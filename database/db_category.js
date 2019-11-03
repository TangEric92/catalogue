const mongoose = require("mongoose");

const Category = mongoose.model("Category", {
  title: { type: String },
  description: { type: String },
  department: { type: mongoose.Schema.Types.ObjectId, ref: "Department" }
});

module.exports = Category;
