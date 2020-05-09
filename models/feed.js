const mongoose = require("mongoose");
const Joi = require("joi");

Joi.objectId = require("joi-objectid")(Joi);

const feedSchema = new mongoose.Schema({
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  type: {
    type: String,
    enum: ["homework", "announcement"],
    required: true
  },
  course: {
    type: new mongoose.Schema({
      name: {
        type: String,
        required: true
      }
    }),
    required: true
  },
  // course: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: "Course",
  //   required: true
  // },
  deadline: {
    type: Date
  },
  datePosted: {
    type: Date,
    required: true,
    default: Date.now
  },
  content: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 3000
  }
});

const Feed = mongoose.model("Feed", feedSchema);

function validateFeed(feed) {
  const schema = {
    postedBy: Joi.objectId(),
    type: Joi.string(),
    course: Joi.objectId(),
    deadline: Joi.date(),
    datePosted: Joi.date(),
    content: Joi.string()
      .min(2)
      .max(3000),
    _id: Joi.objectId()
  };

  return Joi.validate(feed, schema);
}

exports.Feed = Feed;
exports.feedSchema = feedSchema;
exports.validate = validateFeed;
