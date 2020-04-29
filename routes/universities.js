const express = require("express");
const router = express.Router();
const { University, validate } = require("../models/university");
const auth = require("../middleware/auth");

router.get("/", auth, async (req, res) => {
  const universities = await University.find()
    .select("-__v")
    .sort("name");

  res.send(universities);
});

router.get("/:id", auth, async (req, res) => {
  const university = await University.findOne().select("-__v");

  res.send(university);
});

router.post("/", auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let university = await University.findOne({
    name: req.body.name
  });
  if (university) return res.status(400).send("This university already exist.");

  university = new University({ name: req.body.name });

  university = await university.save();

  res.send(university);
});

module.exports = router;
