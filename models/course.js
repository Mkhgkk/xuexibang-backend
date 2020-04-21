const Joi = require("joi");
const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50
  },
  number: {
    type: Number,
    required: true
  },
  university: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "University"
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
  Time: {
    type: String
  },
  classroom: {
    type: String
  },
  qqNumber: {
    type: Number
  },
  Notes: {
    type: String
  },
  Thumbnail: {
    type: String
  }
});

const Course = mongoose.model("Course", courseSchema);

function validateCourse(course) {
  const schema = {
    name: Joi.string()
      .min(5)
      .max(50)
      .required(),
    number: Joi.number().required()
    // name: Joi.ObjectId(),
    // name: Joi.ObjectId(),
  };

  return Joi.validate(course, schema);
}

exports.courseSchema = courseSchema;
exports.Course = Course;
exports.validate = validateCourse;
