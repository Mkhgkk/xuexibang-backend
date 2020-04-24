const Joi = require("joi");
const mongoose = require("mongoose");

Joi.objectId = require('joi-objectid')(Joi)

const commentSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true,
    },
    postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    datePosted: {
        type: Date,
        required: false
    },
    feedId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Feed'
    },
});

const Comment = mongoose.model("Comment", commentSchema);

function validateComment(comment) {
    const schema = Joi.object({
        content: Joi.string().required(),
        postedBy: Joi.objectId(),
        datePosted: Joi.date(),
        feedId: Joi.objectId()
    })

    return Joi.validate(comment, schema)
}

exports.commentSchema = commentSchema;
exports.Comment = Comment;
exports.validate = validateComment;