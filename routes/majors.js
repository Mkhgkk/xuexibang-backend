const express = require("express");
const router = express.Router();
const { Major, validate } = require("../models/major");
const auth = require("../middleware/auth");

router.get("/", auth, async (req, res) => {
  const majors = await Major.find()
    .select("-__v")
    .sort("name");

  res.send(majors);
});

router.post("/", auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let major = await Major.findOne({
    name: req.body.name
  });
  if (major) return res.status(400).send("This major already exist.");

  major = new Major({ name: req.body.name });

  major = await major.save();

  res.send(major);
});

module.exports = router;
