const express = require("express");

const { validate } = require("../validators/validators.js");
const { verifyJWT } = require("../middlewares/auth.middleware.js");
const {
  getArticles,
  createArticle,
  favoriteArticle,
  removeFavoriteArticle,
} = require("../controllers/articles.controllers.js");

const router = express.Router();

router.route("/articles").get(getArticles);
router.route("/article").post(verifyJWT, createArticle);
router.route("/article/:slug/favorite").post(verifyJWT, favoriteArticle);
router.route("/article/:slug/favorite").delete(verifyJWT, removeFavoriteArticle);

module.exports = router;
