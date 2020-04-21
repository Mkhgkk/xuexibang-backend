const mongoose = require("mongoose");
const Joi = require("joi");

const feedSchema = new mongoose.Schema({
    postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    type: {
        type: String,
        enum: ['homework', 'announcement'],
        required: true
    },
    deadline: {
        type: Date,
    },
    datePosted: {
        type: Date
    },
    content: {
        type: String,
        required: true
    }

})

const Feed = mongoose.model("Feed", feedSchema);

function validateFeed(feed) {
    const schema = {
        type: Joi.string()
    }
}

exports.Feed = Feed;
exports.feedSchema = feedSchema;
exports.validate = validateFeed;