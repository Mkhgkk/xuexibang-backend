const express = require("express");
const { Feed, validate } = require("../../models/feed")
const router = express.Router();

router.get("/", async (req, res) => {
    const feeds = await Feed.find().select("-__v");
    if (!feeds) return res.status(404).send("No feeds found for you");
    res.send(feeds);
})

router.post("/", async (req, res) => {
    // const { error } = validate(req.body);
    // if (error) return res.status(400).send(error.details[0].message);

    let feed = new Feed({ postedBy: req.body.postedBy, type: req.body.type, content: req.body.content })
    feed = await feed.save()
    res.send(feed)
})


module.exports = router;