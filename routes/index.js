const express = require("express");

const router = express.Router();

router.use("/review", require("./review"));

module.exports = router;
