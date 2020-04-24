const mongoose = require("mongoose");
const Joi = require("joi");

Joi.objectId = require('joi-objectid')(Joi)

const replySchema = new mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    datePosted: {
        type: Date,
    },
    commentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment'
    }
})

const Reply = mongoose.model("Reply", replySchema)

function validateReply(reply) {
    const schema = Joi.object({
        content: Joi.string().required(),
        postedBy: Joi.objectId(),
        datePosted: Joi.date(),
        commentId: Joi.objectId()
    });

    return Joi.validate(reply, schema);
}

exports.replySchema = replySchema;
exports.Reply = Reply;
exports.validate = validateReply;