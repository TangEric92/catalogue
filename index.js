const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyparser = require("body-parser");
app.use(bodyparser.json());

mongoose.connect("mongodb://localhost/catalogue", { useNewUrlParser: true });

const department = require("./routes/department");
const category = require("./routes/category");
const product = require("./routes/product");
const review = require("./routes/review");

app.use(department);
app.use(category);
app.use(product);
app.use(review);
//const review = require("./routes");
//app.use(review);
app.listen(3000, () => {
  console.log("Server Launched");
});
