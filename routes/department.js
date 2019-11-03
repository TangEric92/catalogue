const express = require("express");
const router = express.Router();

const db_department = require("../database/db_department");
const db_category = require("../database/db_category");
const db_product = require("../database/db_product");

//create
router.post("/department/create", async (req, res) => {
  try {
    const title = req.body.title;
    if (title) {
      const department = await db_department.findOne({ title: title });
      if (department === null) {
        const department = new db_department({
          title: req.body.title
        });
        department.save();
        res.json("Département créé");
        return;
      }
      res.json("Le département existe déjà !");
    }
    res.json("bad request");
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

//read
router.get("/department", async (req, res) => {
  try {
    const department = await db_department.find();
    res.json(department);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

//update
router.put("/department/update", async (req, res) => {
  const id = req.body.id;
  const title = req.body.title;
  try {
    if (id && title) {
      const department = await db_department.findOne({ _id: id });
      if (department !== null) {
        department.title = title;
        await department.save();
        res.json("Nouveau nom mise à jour");
        return;
      } else {
        return res.json("Cet id n'existe pas");
      }
    }
    res.json("bas request");
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

//delete
router.delete("/department/delete", async (req, res) => {
  try {
    const id = req.body.id;
    if (id) {
      const department = await db_department.findOne({ _id: id });

      if (department !== null) {
        const category = await db_category.find({
          department: department._id
        });
        if (category !== null) {
          for (let i = 0; i < category.length; i++) {
            //console.log(category[i]);
            const product = await db_product.find({
              category: category[i]
            });
            if (product !== null) {
              for (let j = 0; j < product.length; j++) {
                await product[j].remove();
              }
            }
            await category[i].remove();
          }
        }
        await department.remove();

        res.json("Suppression terminé");
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
