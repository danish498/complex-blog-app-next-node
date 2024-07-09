const { logger } = require("../logger/winston.logger");
const db = require("../models");

const fs = require("fs");

const User = db.User;

/**
 * Generates a unique username suggestion based on the provided username,
 * appending variations with random numbers and symbols until a unique name is found
 * in the database.
 *
 * @param {string} username The username to base suggestions on.
 * @returns {Promise<string|null>} A unique username suggestion, or null if none found.
 * @throws {Error} If an error occurs during database interaction.
 */
async function generateUniqueSuggestedNames(username) {
  const variations = ["_", "@", "", Math.floor(Math.random() * 100)];

  const suggestions = [];

  for (const variation of variations) {
    const suggestedName = username + variation;

    try {
      const existingUser = await User.findOne({
        where: { username: suggestedName },
      });
      if (!existingUser) {
        suggestions.push(suggestedName);
        if (suggestions.length === 3) {
          return suggestions; // Found 3 unique names, return them
        }
      }
    } catch (error) {
      logger.error(`Error checking username availability: ${error.message}`);
      throw error;
    }
  }

  // If all variations are taken, return null
  return null;
}

const removeLocalFile = (localPath) => {
  fs.unlink(localPath, (err) => {
    if (err) console.log("Error while removing local files: ", err);
    else {
      console.log("Removed local: ", localPath);
    }
  });
};

const getRandomNumber = (max) => {
  return Math.floor(Math.random() * max);
};

const appendTagList = (articleTags, article) => {
  const tagList = articleTags.map((tag) => tag.name);

  if (!article) return tagList;
  delete article.dataValues.tagLists;
  article.dataValues.tagList = tagList;
};

const appendFavorites = async (loggedUser, article) => {
  const favorited = await article.hasUser(loggedUser ? loggedUser : null);
  article.dataValues.favorited = loggedUser ? favorited : false;
  const favoritesCount = await article.countUsers();
  article.dataValues.favoritesCount = favoritesCount;
};

const appendFollowers = async (loggedUser, toAppend) => {
  //
  if (toAppend?.author) {
    const author = await toAppend.getAuthor();
    // console.log(Object.getOwnPropertyNames(author.__proto__));
    const following = await author.hasFollowers(loggedUser ? loggedUser : null);
    toAppend.author.dataValues.following = loggedUser ? following : false;

    const followersCount = await author.countFollowers();
    toAppend.author.dataValues.followersCount = followersCount;
    //
  } else {
    const following = await toAppend.hasFollower(
      loggedUser ? loggedUser : null
    );
    toAppend.dataValues.following = loggedUser ? following : false;

    const followersCount = await toAppend.countFollowers();
    toAppend.dataValues.followersCount = followersCount;
  }
};

module.exports = {
  generateUniqueSuggestedNames,
  removeLocalFile,
  getRandomNumber,
  appendTagList,
  appendFavorites,
  appendFollowers,
};
