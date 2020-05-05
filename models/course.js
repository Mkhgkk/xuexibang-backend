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
    type: String,
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
    required: false
  },
  laoshi: {
    type: String
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
    type: String
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
      .max(50),
    number: Joi.string(),
    university: Joi.objectId(),
    major: Joi.objectId(),
    laoshi: Joi.string(),
    semester: Joi.string(),
    weeks: Joi.string(),
    time: Joi.string(),
    classroom: Joi.string(),
    qqNumber: Joi.string(),
    notes: Joi.string(),
    thumbnail: Joi.string(),
    admin: Joi.array().items(Joi.objectId()),
    _id: Joi.objectId()
  };

  return Joi.validate(course, schema);
}

exports.courseSchema = courseSchema;
exports.Course = Course;
exports.validate = validateCourse;
