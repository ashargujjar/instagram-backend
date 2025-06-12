const express = require("express");
const userAction = require("../controller/userAction");
const is_auth = require("../is_auth/auth");

const router = express.Router();
router.delete("/userPost/:id", is_auth, userAction.deleteUserPost);
router.post("/postComment", is_auth, userAction.postComment);
router.patch("/like/:postId", is_auth, userAction.postLike);
router.patch("/disLike:/postId", is_auth, userAction.removeLike);
module.exports = router;
