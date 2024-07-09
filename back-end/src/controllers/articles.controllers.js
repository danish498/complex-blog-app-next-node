const db = require("../models");
const { asyncHandler } = require("../utils/asyncHandler");
const { ApiResponse } = require("../utils/ApiResponse");
const { ApiError } = require("../utils/ApiErrors");
const color = require("colors");
const { Op } = require("sequelize");
const { logger } = require("../logger/winston.logger");
const {
  appendFollowers,
  appendFavorites,
  appendTagList,
} = require("../helper/helper");
const { default: slugify } = require("slugify");

const Article = db.Article;
const User = db.User;

//! TODO: Article feed (Following user articles)
//! TODO: UPDATE Article
//! TODO: GET Article
const includeOptions = [
  {
    model: db.Tags,
    as: "tagLists",
    attributes: ["name"],
    through: { attributes: [] },
  },
  { model: User, as: "author", attributes: { exclude: ["email", "password"] } },
];

/**-
  * @description     get the article all articles
  * @route           GET /articles
  * @access          Not Protected
 */

const getArticles = asyncHandler(async (req, res, next) => {
  const { tag, author, favorited, limit = 20, offset = 0 } = req.query;
  const { loggedUser } = req;

  const searchOptions = {
    include: [
      {
        model: db.Tags,
        as: "tagLists",
        attributes: ["name"],
        through: { attributes: [] }, // ? this will remove the rows from the join table
        // where: tag ? { name: tag } : {},
        ...(tag && { where: { name: tag } }),
      },
      {
        model: User,
        as: "author",
        attributes: { exclude: ["password", "email"] },
        // where: author ? { username: author } : {},
        ...(author && { where: { username: author } }),
      },
    ],
    limit: parseInt(limit),
    offset: parseInt(offset),
    order: [["created_at", "DESC"]],
    distinct: true,
  };

  let articles = { rows: [], count: 0 };

  if (favorited) {
    const user = await User.findOne({ where: { username: favorited } });

    articles.rows = await user.getFavorites(searchOptions);
    articles.count = await user.countFavorites();
  } else {
    articles = await Article.findAndCountAll(searchOptions);
  }

  for (let article of articles.rows) {
    const articleTags = await article.getTagLists();

    // const articleTags = article.tagLists;
    appendTagList(articleTags, article);
    // await appendFollowers(loggedUser, article);
    await appendFavorites(loggedUser, article);

    //? sequelize method you can check on work around that

    delete article.dataValues.Favorites;
  }
  console.log(Object.getOwnPropertyNames(loggedUser.__proto__));

  // res
  //   .status(200)
  //   .json({ articles: articles.rows, articlesCount: articles.count });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { articles: articles.rows, articlesCount: articles.count },
        "Article data fetched successfully"
      )
    );
});

//@description       Create a new article
//@route             POST /articles
//@access            Protected

const createArticle = asyncHandler(async (req, res, next) => {
  const { title, description, body, tagList } = req.body;
  const loggedUser = req.user;

  console.log("createArticle", loggedUser);

  const slug = slugify(title, { lower: true });

  const slugInDb = await Article.findOne({
    where: {
      slug: slug,
    },
  });

  if (slugInDb) {
    throw new ApiError(400, "Title Already Existed", {
      title: "Title already  existed",
    });
  }

  const article = await Article.create({
    title: title,
    description: description,
    body: body,
    slug: slug,
  });

  for (const tag of tagList) {
    const tagInDb = await db.Tags.findOne({
      where: {
        name: tag,
      },
    });

    if (tagInDb) {
      article.addTagList(tagInDb);
    } else if (tag.length > 2) {
      const newTag = await db.Tags.create({
        name: tag.trim(),
      });
      article.addTagList(newTag);
    }
  }

  delete loggedUser.dataValues.token;

  article.dataValues.tagList = tagList;
  article.setAuthor(loggedUser);
  article.dataValues.author = loggedUser;
  await appendFollowers(loggedUser, loggedUser);
  await appendFavorites(loggedUser, article);

  return res
    .status(200)
    .json(
      new ApiResponse(200, { article: article }, "Article created successfully")
    );

  // console.log(color.bgGreen(description, title, tagList, body));
});

//@description       Favorite article
//@route             POST /articles/:articleId
//@access            Protected

const favoriteArticle = asyncHandler(async (req, res, next) => {
  const loggedUser = req.user;
  const { slug } = req.params;

  const article = await Article.findOne({
    where: {
      slug: slug,
    },
    include: includeOptions,
  });

  if (!article) {
    throw new ApiError(404, "Article not found");
  }

  await loggedUser.addFavorite(article);
  const articleTags = await article.getTagLists();
  appendTagList(articleTags, article);
  await appendFollowers(loggedUser, article);
  await appendFavorites(loggedUser, article);
  return res
    .status(200)
    .json(
      new ApiResponse(200, { article: article }, "Article created successfully")
    );
});

const removeFavoriteArticle = asyncHandler(async (req, res, next) => {
  const loggedUser = req.user;
  const { slug } = req.params;

  const article = await Article.findOne({
    where: {
      slug: slug,
    },
    include: includeOptions,
  });

  if (!article) {
    throw new ApiError(404, "Article not found");
  }

  await loggedUser.removeFavorite(article);

  const articleTags = await article.getTagLists();
  appendTagList(articleTags, article);
  await appendFollowers(loggedUser, article);
  await appendFavorites(loggedUser, article);

  return res
    .status(200)
    .json(
      new ApiResponse(200, { article: article }, "Article created successfully")
    );
});

module.exports = {
  getArticles,
  createArticle,
  favoriteArticle,
  removeFavoriteArticle,
};
