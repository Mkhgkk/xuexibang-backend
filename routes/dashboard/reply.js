const express = require("express");
const { Reply, validate } = require("../../models/reply");
const auth = require("../../middleware/auth");
const mongoose = require("mongoose");
const moment = require("moment");

const router = express.Router();

router.get("/:commentId", async (req, res) => {
    const results = await Reply.find({ commentId: req.params.commentId });
    res.send(results)
});

router.post("/:commentId", auth, async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const reply = await new Reply({
        content: req.body.content,
        postedBy: req.user._id,
        commentId: req.params.commentId,
        datePosted: moment().toJSON()
    });

    await reply.save();

    res.send(reply);

})

router.put("/:replyId", auth, async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const reply = await Reply.findByIdAndUpdate(
        req.params.replyId,
        {
            content: req.body.content
        },
        { new: true }
    );

    res.send(reply)
});

router.delete("/:replyId", auth, async (req, res) => {
    const reply = await Reply.findByIdAndRemove(req.params.replyId);

    if (!reply)
        return res.status(404).send("The reply with the given ID was not found.");

    res.send(reply);

})


module.exports = router;