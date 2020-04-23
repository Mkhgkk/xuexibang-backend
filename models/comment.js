const mongoose = reqire("mongoose");
const Joi = require("joi");

Joi.objectId = require('joi-objectid')(Joi)

const commentSchema = new mongoose.SChema({
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
})

const Comment = mongoose.model("Feed", commentSchema);

function validateComment(comment) {
    const schema = Joi.object({
        content: Joi.string().required(),
        postedBy: Joi.objectId,
        datePosted: Joi.date(),
        feedId: Joi.objectId.required()
    })

    return Joi.validate(comment, schema)
}

exports.commentSchema = commentSchema;
exports.Comment = Comment;
exports.validate = validateComment;