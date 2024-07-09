//@description     get  all comments
//@route           GET /comments
//@access         Protected

const { appendFollowers } = require("../helper/helper");
const { logger } = require("../logger/winston.logger");
const db = require("../models");
const { ApiError } = require("../utils/ApiErrors");
const { ApiResponse } = require("../utils/ApiResponse");
const { asyncHandler } = require("../utils/asyncHandler");

const Comments = db.Comments;
const Article = db.Article;

//@description     get all comments
//@route           GET /comments/:id
//@access         Not Protected

const getComments = asyncHandler(async (req, res, next) => {
  const slug = req.params.slug;
  const loggedUser = req.user;

  const article = await Article.findOne({
    where: { slug: slug },
  });

  if (!article) {
    throw new ApiError(404, "Article not found");
  }

  //? sequelize method you can check on work around that
  console.log(Object.getOwnPropertyNames(article.__proto__));

  const comments = await article.getComments({
    include: [
      {
        model: db.User,
        as: "author",
        attributes: ["user_id", "username", "image"],
      },
    ],
  });

  for (let comment of comments) {
    await appendFollowers(loggedUser, comment);
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { comment: comments },
        "Comment fetched successfully"
      )
    );
});

//@description    Create a new comment
//@route           POST /comments/:id
//@access          Protected

const createComment = asyncHandler(async (req, res, next) => {
  const slug = req.params.slug;
  const loggedUser = req.user;
  const { name } = req.body;

  const article = await Article.findOne({
    where: { slug: slug },
    include: [
      {
        as: "author",
        model: db.User,
        attributes: ["user_id", "username", "image"],
      },
    ],
  });

  if (!article) {
    throw new ApiError(404, "Article not found");
  }

  const comment = await Comments.create({
    name: name,
    article_id: article.article_id,
    author_id: author.author_id,
  });

  await appendFollowers(loggedUser, loggedUser);

  comment.dataValues.author = loggedUser;

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { comment: comment },
        "Commented created successfully"
      )
    );
});

//@description     Delete a  comment
//@route           PUT /comments/:id
//@access          Protected

const deleteComment = asyncHandler(async (req, res, next) => {
  const loggedUser = req.user;

  const slug = req.params.slug;
  const commentId = req.params.id;

  const article = await Article.findOne({
    where: { slug: slug },
  });

  if (!article) {
    throw new ApiError(404, "Article not found");
  }

  const comment = await Comment.findOne({
    where: { comment_id: commentId },
  });

  if (!comment) {
    throw new ApiError(404, "Comment not found");
  }

  if (comment.author_id !== loggedUser.user_id) {
    throw new ApiError(403, "You are not authorized to delete this comment");
  }

  await comment.destroy();

  return res
    .status(200)
    .json(
      new ApiResponse(200, { comment: comment }, "Comment deleted successfully")
    );
});

module.exports = {
  getComments,
  createComment,
  deleteComment,
};
