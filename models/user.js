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
  newPassword: {
    type: String,
    minlength: 6,
    maxlength: 1024
  },
  userName: {
    type: String,
    minlength: 1,
    maxlength: 50
  },
  avatar: {
    type: String,
    minlength: 5,
    maxlength: 1024
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
  university: {
    type: String
  },
  major: {
    type: String
  },
  courses: {
    type: Array
  }
  // university: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: "University"
  // },
  // major: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: "Major"
  // },
  // courses: {
  //   type: [mongoose.Schema.Types.ObjectId],
  //   ref: "Course"
  // }
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
      .email(),
    password: Joi.string()
      .min(6)
      .max(255),
    newPassword: Joi.string()
      .min(6)
      .max(255),
    userName: Joi.string()
      .min(1)
      .max(50),
    avatar: Joi.string()
      .min(5)
      .max(1024),
    inAdmin: Joi.boolean(),
    university: Joi.string(),
    major: Joi.string(),
    courses: Joi.array()
  };
  return Joi.validate(user, schema);
}

exports.User = User;
exports.validate = validateUser;
