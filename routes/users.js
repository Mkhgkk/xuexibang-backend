const express = require("express");
const router = express.Router();
const { User, validate } = require("../models/user");
const _ = require("lodash");
const bcrypt = require("bcrypt");
const auth = require("../middleware/auth");

router.get("/me", auth, async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
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
  res.header("x-auth-token", token).send(_.pick(user, ["_id", "email"]));
});

router.delete("/", auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("Invalid email or password.");

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).send("Invalid email or password.");

  user = await User.deleteOne({ email: req.body.email });

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

  user = await User.findOneAndUpdate(
    { _id: req.user._id },
    { $set: { password: req.body.newPassword } }
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

  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      userName: req.body.userName,
      avatar: req.body.avatar,
      university: req.body.university,
      major: req.body.major,
      courses: req.body.courses
    },
    { new: true }
  );

  if (!user) return res.status(404).send("User does not exist.");
  res.send(user);
});
// router.put("/step1", auth, async (req, res) => {
//   const { error } = validate(req.body);
//   if (error) return res.status(400).send(error.details[0].message);

//   const user = await User.findOneAndUpdate(
//     { _id: req.user._id },
//     { $set: { userName: req.body.userName, avatar: req.body.avatar } }
//   );

//   if (!user) return res.status(404).send("User does not exist.");
//   res.send(user);
// });

// router.put("/step2", auth, async (req, res) => {
//   const { error } = validate(req.body);
//   if (error) return res.status(400).send(error.details[0].message);

//   const user = await User.findOneAndUpdate(
//     { _id: req.user._id },
//     { $set: { university: req.body.university, major: req.body.major } }
//   );

//   if (!user) return res.status(404).send("User does not exist.");
//   res.send(user);
// });

// router.put("/step3", auth, async (req, res) => {
//   const { error } = validate(req.body);
//   if (error) return res.status(400).send(error.details[0].message);

//   const user = await User.findOneAndUpdate(
//     { _id: req.user._id },
//     { $set: { courses: req.body.courses } }
//   );

//   if (!user) return res.status(404).send("User does not exist.");
//   res.send(user);
// });

// router.put("/mypage", auth, async (req, res) => {
//   const { error } = validate(req.body);
//   if (error) return res.status(400).send(error.details[0].message);

//   const user = await User.findByIdAndUpdate(
//     req.user._id,
//     {
//       userName: req.body.userName,
//       university: req.body.university,
//       major: req.body.major,
//       avatar: req.body.avatar
//     },
//     { new: true }
//   );

//   if (!user) return res.status(404).send("User does not exist.");
//   res.send(user);
// });

module.exports = router;
