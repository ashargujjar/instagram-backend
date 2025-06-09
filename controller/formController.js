const User = require("../model/user");
const Bio = require("../model/bio");
const Post = require("../model/image");
const jwt = require("jsonwebtoken");

const cloudinary = require("../cloudinaryConfig");
const { validationResult, body } = require("express-validator");
exports.postLoign = async (req, res, next) => {
  const error = validationResult(req);
  if (error.isEmpty()) {
    const user = await User.Login(req.body.username, req.body.password);

    if (user) {
      const token = jwt.sign({ user: user }, "this_is_my_first_aap_Inshallah");

      return res.status(201).json({
        login: true,
        user: user,
        message: "login succesfully",
        token: token,
      });
    } else {
      return res.status(401).json({
        login: false,
        message: "Invalid username or password",
      });
    }
  } else {
    return res.status(401).json({
      signup: false,
      error: error.array(),
      message: "unable to post reqest",
    });
  }
};
exports.postSignup = async (req, res, next) => {
  const error = validationResult(req);
  const user = new User(
    req.body.email,
    req.body.password,
    req.body.fullname,
    req.body.username
  );
  if (error.isEmpty()) {
    const saved = await user.save();
    if (saved) {
      return res.status(201).json({
        signup: true,
        message: "Signup Succesfull login now",
      });
    } else {
      return res.status(401).json({ message: "Invalid username or password" });
    }
  } else {
    return res.status(401).json({
      signup: false,
      error: error.array(),
      message: "unable to post reqest",
    });
  }
};
exports.updateProfile = async (req, res, next) => {
  const profile = await Bio.getProfile(req.user.username);
  const path = req.file.path;
  console.log(path);
  if (profile) {
    const del = await cloudinary.uploader.destroy(profile.public_id);
    const upload = await cloudinary.uploader.upload(path);

    const response = await Bio.updateBio(
      req.user.username,
      upload.public_id,
      upload.secure_url,
      req.body.name,
      req.body.bio
    );
    if (response) {
      return res.status(201).json({
        message: "Profile updated/created succesfull",
      });
    } else {
      return res.status(201).json({
        message: "eorror updated/created bio",
      });
    }
  } else {
    const upload = await cloudinary.uploader.upload(path);
    const bio = new Bio(
      req.user.username,
      upload.public_id,
      upload.secure_url,
      req.body.name,
      req.body.bio
    );
    const respo = await bio.save();
    if (respo) {
      return res.status(201).json({
        message: "Profile updated/created succesfull",
      });
    } else {
      return res.status(201).json({
        message: "eorror updated/created bio",
      });
    }
  }
};
exports.getProfile = async (req, res, next) => {
  const username = req.params.username;
  const profile = await Bio.getProfile(username);
  if (profile) {
    return res.status(201).json({
      bio: profile,
    });
  }
};
exports.uploadImage = async (req, res, next) => {
  const path = req.file.path;
  const uploadImage = await cloudinary.uploader.upload(path);
  if (uploadImage) {
    const post = new Post(
      req.user.username,
      uploadImage.public_id,
      uploadImage.secure_url,
      req.body.title
    );
    const response = await post.save();

    if (response) {
      const resp = await Bio.incPost(req.user.username);
      return res.status(201).json({
        message: "post inserted successfully",
      });
    }
  }
};
exports.getPost = async (req, res, next) => {
  const post = await Post.getPosts(req.user.username);

  return res.status(201).json({
    posts: post,
  });
};
exports.searchUser = async (req, res, next) => {
  // const userId = req.query.userId;
  const username = req.user.username;
  console.log(username);
  const searchedUsername = req.body.searchedUsername;
  // let followed = false;
  // User.checkFollower(userId, username).then((user) => {
  //   if (user) {
  //     followed = true;
  //   }
  // });
  let user = await User.checkUsername(searchedUsername);
  if (user) {
    let Alreadyfollowed = await User.checkFollowing(
      username,
      user._id.toString()
    );
    if (Alreadyfollowed) {
      return res.status(200).json({
        followed: true,
        user: user,
      });
    } else {
      return res.status(200).json({
        followed: false,
        user: user,
      });
    }
  } else {
    return res.status(401).json({
      message: "no user found",
    });
  }
};
// exports.explore = async (req, res, next) => {
//   const username = req.query.username;
// };
exports.follow = async (req, res, next) => {
  const username = req.user.username; // the name of actual user
  const userId = req.body.userId; // user following to the user
  const user = await User.checkUsername(username);
  const getFollowingUser = await User.getUserById(userId);
  let check = await User.checkFollowing(username, userId);
  if (!check) {
    let response = await User.addFollowing(username, userId);
    let addFollower = await User.addFollower(userId, user._id.toString());
    console.log("follower addf", addFollower);
    if (response) {
      const inc = Bio.incFollower(getFollowingUser.username);
      const incFollwing = Bio.incFollowing(username);
      return res.json({
        message: "followed succesfull",
      });
    }
  }
};

exports.unFollow = async (req, res, next) => {
  const username = req.user.username; // the name of actual user
  const userId = req.body.userId; // user following to the user
  const user = await User.checkUsername(username);
  const getFollowingUser = await User.getUserById(userId);
  let check = await User.checkFollowing(username, userId);
  if (check) {
    let removeFollow = User.removeFollowing(username, userId);
    let removeFollower = User.removeFollower(userId, user._id.toString());
    if (removeFollower) {
      const decFollowing = Bio.decfollowing(username);
      const decFollower = Bio.decFollower(getFollowingUser.username);

      return res.json({
        message: "unfollowed succesfull",
      });
    }
  } else {
    return res.json({
      message: "Error unfollow",
    });
  }
};
exports.exploreUsers = async (req, res, next) => {
  const userId = req.user._id;
  let Alreadyfollowing = await User.getAllFollowings(userId);
  console.log(Alreadyfollowing);
  return res.status(201).json({
    Alreadyfollowed: Alreadyfollowing,
    followed: true,
  });
};
exports.exploreUsersExceptFollowers = async (req, res, next) => {
  const userId = req.user._id;
  let notFollowing = await User.GetNotFollowings(userId);
  console.log(notFollowing);
  return res.status(201).json({
    notFollowing: notFollowing,
    followed: false,
  });
};
exports.getPosts = async (req, res, next) => {
  const id = req.user._id;
  const post = await User.getAllFollowingsPost(id);
  console.log(post);
  return res.status(201).json({
    posts: post,
  });
};
exports.getPostUser = async (req, res, next) => {
  const id = req.params.id;
  const post = await Post.getUserPostById(id);
  const bio = await Bio.getProfile(post.username);
  console.log("in user post");
  if (post) {
    console.log(post);
    return res.status(201).json({
      post: post,
      bio: bio,
      message: "success",
    });
  } else {
    return res.status(201).json({
      message: "error",
    });
  }
};
