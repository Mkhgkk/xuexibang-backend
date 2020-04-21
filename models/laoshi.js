const mongoose = require('mongoose');
const Joi = require('joi');

const laoshiSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },

})

const Laoshi = mongoose.model("Laoshi", laoshiSchema);

function validateLaoshi(laoshi) {
    const schema = {
        name: Joi.string().required()
    }

    return Joi.validate(laoshi, schema)
}

exports.Laoshi = Laoshi;
exports.laoshiSchema = laoshiSchema;
exports.validate = validateLaoshi;