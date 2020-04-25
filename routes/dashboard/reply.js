const express = require("express");
const { Reply, validate } = require("../../models/reply");
const auth = require("../../middleware/auth");
const mongoose = require("mongoose");
const moment = require("moment");

const router = express.Router();

// getting all replies for a comment
// :id equals commentId
router.get("/:id", async (req, res) => {
    const results = await Reply.find({ commentId: req.params.id });
    res.send(results)
});

// posting a reply
// :id equals commentId
router.post("/:id", auth, async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const reply = await new Reply({
        content: req.body.content,
        postedBy: req.user._id,
        commentId: req.params.id,
        datePosted: moment().toJSON()
    });

    await reply.save();

    res.send(reply);

})

// updating a reply
// :id equals replyId
router.put("/:id", auth, async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const reply = await Reply.findByIdAndUpdate(
        req.params.id,
        {
            content: req.body.content
        },
        { new: true }
    );

    res.send(reply)
});

// deleting a reply
// :id equals replyId
router.delete("/:id", auth, async (req, res) => {
    const reply = await Reply.findByIdAndRemove(req.params.id);

    if (!reply)
        return res.status(404).send("The reply with the given ID was not found.");

    res.send(reply);

})


module.exports = router;