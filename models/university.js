const mongoose = require('mongoose');
const Joi = require('joi');

const universitySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    }
})

const University = mongoose.model("University", universitySchema);

function validateUniversity(university) {
    const schema = {
        name: Joi.string().min(5).max(50).required()
    }

    return Joi.validate(university, schema)
}

exports.universitySchema = universitySchema;
exports.University = University;
exports.validate = validateUniversity;