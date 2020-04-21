const mongoose = require("mongoose");
const Joi = require("joi");

const majorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    }
})

const Major = mongoose.model("Major", majorSchema);

function validateMajor(major) {
    const schema = {
        name: Joi.string().required()
    }
}

exports.Major = Major;
exports.majorSchema = majorSchema;
exports.validate = validateMajor;