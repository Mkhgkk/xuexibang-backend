const express = require("express");
const { Course, validate } = require("../../models/course")
const router = express.Router();

router.get("/", (req, res) => {
    res.send("Something is working")
})

router.post("/", async (req, res) => {
    // const { error } = validate(req.body);
    // if (error) return res.status(400).send(error.details[0].message);

    let university = new Course({ name: req.body.name, number: req.body.number, university: req.body.university, laoshi: req.body.laoshi })
    university = await university.save()
    res.send(university)
})

// other routers...

module.exports = router;