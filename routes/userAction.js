const express = require("express");
const userAction = require("../controller/userAction");
const is_auth = require("../is_auth/auth");

const router = express.Router();
router.delete("/userPost/:id", is_auth, userAction.deleteUserPost);
router.post("/postComment", is_auth, userAction.postComment);
module.exports = router;
