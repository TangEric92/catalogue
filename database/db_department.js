const mongoose = require("mongoose");

const Department = mongoose.model("Department", { title: { type: String } });

module.exports = Department;
