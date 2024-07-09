const express = require("express");

const { validate } = require("../validators/validators.js");
const { verifyJWT } = require("../middlewares/auth.middleware.js");
const {
  getComments,
  createComment,
  deleteComment,
} = require("../controllers/comments.controllers.js");

const router = express.Router();

router.route("article/comments/:slug").get(getComments);
router.route("article/comments/:slug").post(verifyJWT, createComment);
router.route("article/comments/:slug/:id").put(verifyJWT, deleteComment);
// router.route("/article").post(verifyJWT, createArticle );

module.exports = router;
