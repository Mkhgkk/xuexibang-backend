const Joi = require("joi");
const mongoose = require("mongoose");

Joi.objectId = require("joi-objectid")(Joi);

const courseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 50
  },
  number: {
    type: Number,
    required: true
  },
  university: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "University",
    required: true
  },
  major: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Major",
    required: true
  },
  laoshi: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Laoshi"
  },
  semester: {
    type: String
  },
  weeks: {
    type: String
  },
  time: {
    type: String
  },
  classroom: {
    type: String
  },
  qqNumber: {
    type: Number
  },
  notes: {
    type: String
  },
  thumbnail: {
    type: String
  },
  admin: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "User"
  }
});

const Course = mongoose.model("Course", courseSchema);

function validateCourse(course) {
  const schema = {
    name: Joi.string()
      .min(2)
      .max(50)
      .required(),
    number: Joi.number().required(),
    university: Joi.objectId().required(),
    major: Joi.objectId().required(),
    laoshi: Joi.objectId(),
    semester: Joi.objectId(),
    weeks: Joi.objectId(),
    time: Joi.objectId(),
    classroom: Joi.objectId(),
    qqNumber: Joi.objectId(),
    notes: Joi.objectId(),
    thumbnail: Joi.objectId(),
    admin: Joi.array().items(Joi.objectId())
  };

  return Joi.validate(course, schema);
}

exports.courseSchema = courseSchema;
exports.Course = Course;
exports.validate = validateCourse;
