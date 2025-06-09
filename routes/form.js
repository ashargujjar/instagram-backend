const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const User = require("../model/user");
const formController = require("../controller/formController");
const is_auth = require("../is_auth/auth");

router.post(
  "/login",
  [
    check("username")
      .isLength({ min: 5 })
      .withMessage("username must be five characters long")
      .matches(/^\S*$/)
      .withMessage("Username cannot contain spaces"),
    check("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
  ],
  formController.postLoign
);
router.post(
  "/signup",
  [
    check("username")
      .isLength({ min: 5 })
      .withMessage("Username must be at least 5 characters long")
      .matches(/^\S*$/)
      .withMessage("Username cannot contain spaces")
      .custom(async (value, { req }) => {
        const user = await User.checkUsername(value);
        if (user) {
          throw new Error("Username already exists");
        }
        return true;
      }),
    check("email").isEmail().withMessage("Enter a valid email"),
    check("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
    check("fullname")
      .isLength({ min: 5 })
      .withMessage("Name must be at least 5 characters long"),
  ],
  formController.postSignup
);
router.post("/updateProfile", is_auth, formController.updateProfile);
router.get("/profile/:username", formController.getProfile);
router.post("/uploadImage", is_auth, formController.uploadImage);
router.get("/getPosts/:username", is_auth, formController.getPost);
router.post("/search-user", is_auth, formController.searchUser);
// router.get("/explore", is_auth, formController.explore);
router.post("/follow", is_auth, formController.follow);
router.post("/unFollow", is_auth, formController.unFollow);
router.get("/explore-users/:userId", is_auth, formController.exploreUsers);
router.get(
  "/explore-user-notFollow/:userId",
  is_auth,
  formController.exploreUsersExceptFollowers
);
router.get("/get/posts/:id", is_auth, formController.getPosts); // all followers post
router.get("/user/post/:id", formController.getPostUser); // specific user post
module.exports = router;
