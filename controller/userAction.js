const Post = require("../model/image");
const Bio = require("../model/bio");
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
