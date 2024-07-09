const express = require("express");

const { validate } = require("../validators/validators.js");
const { verifyJWT } = require("../middlewares/auth.middleware.js");
const {
  getProfile,
  followUser,
} = require("../controllers/profile.controllers.js");

const router = express.Router();

router.route("/profile").get(getProfile);
router.route("/profile/:username/follow").post(verifyJWT, followUser);

module.exports = router;
