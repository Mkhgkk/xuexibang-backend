const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
    res.send("Something is now working!")
})

// other routers...

module.exports = router;