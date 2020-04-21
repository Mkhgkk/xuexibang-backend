const mongoose = require("mongoose");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const config = require("config");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
    minlength: 5,
    maxlength: 255
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    maxlength: 1024
  },
  // newPassword: {
  //   type: String,
  //   minlength: 6,
  //   maxlength: 1024
  // },
  //   name: {
  //        type: String,
  //        minlength: 1,
  //        maxlength: 50
  //     },

  isAdmin: Boolean
});

userSchema.methods.generateAuthToken = function() {
  const token = jwt.sign(
    { _id: this._id, isAdmin: this.isAdmin },
    config.get("jwtPrivateKey")
  );
  return token;
};

const User = mongoose.model("User", userSchema);

function validateUser(user) {
  const schema = {
    email: Joi.string()
      .min(5)
      .max(255)
      .required()
      .email(),
    password: Joi.string()
      .min(6)
      .max(255)
      .required()
    // newPassword: Joi.string()
    //   .min(6)
    //   .max(255)
    //   .required()
  };
  return Joi.validate(user, schema);
}

exports.User = User;
exports.validate = validateUser;
