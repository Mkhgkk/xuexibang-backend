const express = require("express");
const { Comment, validate } = require("../../models/comment");
const auth = require("../../middleware/auth");
const mongoose = require("mongoose");
const moment = require("moment");

const router = express.Router();

router.get("/:feedId", async (req, res) => {
    const results = await Comment.find({ feedId: req.params.feedId });
    res.send(results)
});

router.post("/:feedId", auth, async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const comment = await new Comment({
        content: req.body.content,
        postedBy: req.user._id,
        feedId: req.params.feedId,
        datePosted: moment().toJSON()
    });

    await comment.save();

    res.send(comment);

})

router.put("/:commentId", auth, async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const comment = await Comment.findByIdAndUpdate(
        req.params.commentId,
        {
            content: req.body.content
        },
        { new: true }
    );

    res.send(comment)
});

router.delete("/:commentId", auth, async (req, res) => {
    const comment = await Comment.findByIdAndRemove(req.params.commentId);

    if (!comment)
        return res.status(404).send("The comment with the given ID was not found.");

    res.send(comment);

})


module.exports = router;