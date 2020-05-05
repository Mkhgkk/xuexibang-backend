const express = require("express");
const router = express.Router();
const { User, validate } = require("../models/user");
const _ = require("lodash");
const bcrypt = require("bcrypt");
const auth = require("../middleware/auth");

router.get("/me", auth, async (req, res) => {
  const user = await User.findById(req.user._id).select("-password -__v");
  res.send(user);
});

router.get("/user/:id", auth, async (req, res) => {
  const user = await User.findById(req.params.id).select("avatar userName _id");
  res.send(user);
});

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send("User already registered.");

  user = new User(_.pick(req.body, ["email", "password"]));
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);

  await user.save();

  const token = user.generateAuthToken();
  //res.header("x-auth-token", token).send(_.pick(user, ["_id", "email"]));
  res.header("x-auth-token", token).send(token);
});

router.delete("/delete/:email/:password", auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.params.email });
  if (!user) return res.status(400).send("Invalid email or password.");

  const validPassword = await bcrypt.compare(
    req.params.password,
    user.password
  );
  if (!validPassword) return res.status(400).send("Invalid email or password.");

  user = await User.deleteOne({ email: req.params.email });

  if (!user) return res.status(404).send("This user does not exist.");

  res.send(user);
});

router.put("/password", auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("Invalid email or password.");

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).send("Invalid email or password.");

  user = await User.findByIdAndUpdate(
    req.user._id,
    {
      password: req.body.newPassword
    },
    { new: true }
  );
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);

  await user.save();

  const token = user.generateAuthToken();
  res.header("x-auth-token", token).send(_.pick(user, ["_id", "email"]));
});

router.put("/", auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let payload = {};

  const keys = Object.keys(req.body);

  let i;
  for (i = 0; i < keys.length; i++) {
    key = keys[i];
    payload[key] = req.body[key];
  }

  const user = await User.findByIdAndUpdate(req.user._id, payload, {
    new: true
  });

  res.send(user);
});

module.exports = router;
