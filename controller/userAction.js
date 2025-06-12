const Post = require("../model/image");
const Bio = require("../model/bio");
const Img = require("../model/image");
const cloudinary = require("../cloudinaryConfig");

const fs = require("fs");
const path = require("path");
exports.deleteUserPost = async (req, res, next) => {
  const id = req.params.id;
  const post = await Post.getPost(id);
  if (post) {
    const public_id = post.public_id;
    console.log(public_id);
    const postDec = await Bio.decPost(req.user.username);

    const resp = await Post.deletePost(id);
    if (resp) {
      const del = await cloudinary.uploader.destroy(public_id);
      return res.json({
        msg: resp,
      });
    }
  } else {
    return res.json({
      msg: "no post found",
    });
  }
};

exports.postComment = async (req, res, next) => {
  const resp = await Post.addComent(
    req.user.username,
    req.body.text,
    req.body.postId
  );
  if (resp) {
    console.log("comment added");
    return res.status(201).json({
      msg: "comment added ",
    });
  } else {
    return res.status(500).json({
      msg: "eror adding the comment",
    });
  }
};
exports.postLike = async (req, res, next) => {
  const postId = req.params.postId;
  try {
    const resp = await Img.likePost(postId, req.user._id);
    if (resp.modifiedCount === 1) {
      return res.status(201).json({ msg: "user liked" });
    } else {
      return res.status(400).json({ msg: "Already liked or post not found" });
    }
  } catch (err) {
    console.error("Like Error:", err);
    return res.status(500).json({ msg: "Server Error" });
  }
};

exports.removeLike = async (req, res, next) => {
  const postId = req.params.postId;
  try {
    const resp = await Img.disLikePost(postId, req.user._id);
    if (resp.modifiedCount === 1) {
      return res.status(201).json({ msg: "user disliked" });
    } else {
      return res.status(400).json({ msg: "Post not found or not liked" });
    }
  } catch (err) {
    console.error("Dislike Error:", err);
    return res.status(500).json({ msg: "Server Error" });
  }
};
