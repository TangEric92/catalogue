const express = require("express");
const router = express.Router();

const db_review = require("../database/db_review");
const db_product = require("../database/db_product");

router.get("/review", async (req, res) => {
  try {
    const review = await db_review.find().populate();
    res.json(review);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post("/review/create", async (req, res) => {
  const id_product = req.body.product;
  const rating = req.body.rating;
  const comment = req.body.comment;
  const username = req.body.username;

  const newReview = new db_review({
    rating: rating,
    comment: comment,
    username: username
  });

  await newReview.save();

  const product = await db_product.findById(req.body.product);

  if (product.reviews === undefined) {
    product.reviews = [];
  }

  product.reviews.push(newReview);
  await product.save();
  res.json("Save");
});

router.put("/review/update", async (req, res) => {
  const id = req.body.id;
  const comment = req.body.comment;
  const rating = req.body.rating;
  try {
    if (id && rating) {
      const review = await db_review.findOne({ _id: id });
      if (review !== null) {
        review.comment = comment;
        review.rating = rating;

        await review.save();

        res.json("mise à jour");
        return;
      }
    }
    res.json("bad request");
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete("/review/delete", async (req, res) => {
  try {
    const id = req.body.id;

    if (id) {
      const review = await db_review.findOne({ _id: id });

      if (review !== null) {
        await review.remove();
        res.json("review supprimé");
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
