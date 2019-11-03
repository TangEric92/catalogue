const express = require("express");
const router = express.Router();

const db_department = require("../database/db_department");
const db_category = require("../database/db_category");
const db_product = require("../database/db_product");

//create
router.post("/category/create", async (req, res) => {
  try {
    const title = req.body.title;
    const description = req.body.description;
    const department_id = req.body.department;

    if (title && description && department_id) {
      const category = await db_category.findOne({ title: title });

      if (category === null) {
        const newCategory = new db_category({
          title: title,
          description: description,
          department: department_id
        });
        await newCategory.save();
        res.json("catégorie créé");
        return;
      } else {
        return res.json("La catégorie existe déjà");
      }
    }
    res.json("bad request");
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

//read
router.get("/category", async (req, res) => {
  try {
    const category = await db_category.find().populate("department");
    res.json(category);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

//update
router.put("/category/update", async (req, res) => {
  const id = req.body.id;
  const title = req.body.title;
  const description = req.body.description;
  const department = req.body.department;
  try {
    if (id && title) {
      const category = await db_category.findOne({ _id: id });
      console.log(category);
      if (category !== null) {
        category.title = title;
        category.description = description;
        category.department = department;
        await category.save();
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
router.delete("/category/delete", async (req, res) => {
  try {
    const id = req.body.id;
    if (id) {
      const category = await db_category.findOne({ _id: id });
      console.log(category);
      if (category !== null) {
        const product = await db_product.find({
          category: category
        });
        if (product !== null) {
          for (let j = 0; j < product.length; j++) {
            await product[j].remove();
          }
        }
        await category.remove();

        res.json("suppression terminé !");
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
