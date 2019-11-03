const express = require("express");
const router = express.Router();

const db_department = require("../database/db_department");
const db_category = require("../database/db_category");
const db_product = require("../database/db_product");

//create
router.post("/product/create", async (req, res) => {
  try {
    const title = req.body.title;
    const description = req.body.description;
    const price = req.body.price;
    const category_id = req.body.category_id;

    if (title && description && category_id) {
      const product = await db_product.findOne({ title: title });

      if (product === null) {
        const newProduct = new db_product({
          title: title,
          description: description,
          price: price,
          category: category_id
        });
        await newProduct.save();
        res.json("product créé");
        return;
      } else {
        return res.json("La product existe déjà");
      }
    }
    res.json("bad request");
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

//read
router.get("/product", async (req, res) => {
  // MAJ reviews
  const productReview = await db_product.find().populate("reviews");
  for (let i = 0; i < productReview.length; i++) {
    const rates = productReview[i].reviews;
    if (rates.length > 0) {
      let rate = 0;
      for (let j = 0; j < rates.length; j++) {
        rate += rates[j].rating;
      }
      productReview[i].averageRating = rate / rates.length;
      await productReview[i].save();
    }
  }

  // return all product
  const title = req.query.title;
  const priceMin = req.query.pricemin;
  const priceMax = req.query.pricemax;
  const sorted = req.query.sort;
  const category = req.query.category;
  //const price = req.query.price;

  const options = {};
  if (category !== undefined) {
    options.category = category;
  }
  if (title !== undefined) {
    options.title = title;
  }
  if (priceMin !== undefined) {
    options.price = { $gt: priceMin };
  }
  if (priceMax !== undefined) {
    options.price = { $lt: priceMax };
  }
  const sort = {};
  if (sorted === "price-asc") {
    sort.price = "asc";
  }
  if (sorted === "price-desc") {
    sort.price = "desc";
  }

  try {
    const product = await db_product
      .find(options)
      .populate("reviews")
      .populate("category")
      .sort(sort);
    res.json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

//update
router.put("/product/update", async (req, res) => {
  const id = req.body.id;
  const title = req.body.title;
  const description = req.body.description;
  const price = req.body.price;
  const category_id = req.body.category_id;
  try {
    if (id && title) {
      const product = await db_product.findOne({ _id: id });
      console.log(product);
      if (product !== null) {
        product.title = title;
        product.description = description;
        product.price = price;
        product.category_id = category_id;
        await product.save();
        res.json("Nouveau nom mise à jour");
        return;
      }
    }
    res.json("bad request");
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

//delete
router.delete("/product/delete", async (req, res) => {
  try {
    const id = req.body.id;
    console.log(id);
    if (id) {
      console.log("ok");
      const product = await db_product.findOne({ _id: id });
      console.log(product);
      console.log("ko");
      if (product !== null) {
        await product.remove();
        res.json("product supprimé");
        return;
      }
      return res.json("Id non trouvé");
    }
    return res.json("bad request");
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
module.exports = router;
