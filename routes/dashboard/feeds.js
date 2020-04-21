const express = require("express");
const { Feed, validate } = require("../../models/feed")
const router = express.Router();

router.get("/", (req, res) => {
    res.send("Something is working")
})

router.post("/", async (req, res) => {
    // const { error } = validate(req.body);
    // if (error) return res.status(400).send(error.details[0].message);

    let university = new Feed({ postedBy: req.body.postedBy, type: req.body.type, content: req.body.content })
    university = await university.save()
    res.send(university)
})

// other routers...

module.exports = router;