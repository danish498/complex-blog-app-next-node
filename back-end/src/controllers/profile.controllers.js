const db = require("../models");
const { ApiResponse } = require("../utils/ApiResponse");
const { asyncHandler } = require("../utils/asyncHandler");

const getProfile = asyncHandler(async (req, res, next) => {
  const username = req.params.username;

  const loggedUser = req.user;

  const userProfile = await db.User.findOne({
    where: {
      username: username,
    },
  });

  if (!userProfile) {
    throw new ApiError(404, "User not found");
  }

  //   const followers = await userProfile.getFollowers();
  //   const following = await userProfile.getFollowing();
  //   const isFollowed = await loggedUser.isFollowed(userProfile.id);

  let isFollowing = false;

  if (loggedUser) {
    const followers = await user.getFollowers();
    isFollowing = followers.some((user) => user.id === loggedUser.id);
  }

  const profile = {
    username: username,
    image: userProfile.image,
    // bio: userProfile.bio,
    following: isFollowing,
  };

  return res.status(200).json(new ApiResponse(200, { profile: profile }, ""));
});

const followUser = asyncHandler(async (req, res, next) => {
  const username = req.params.username;
  const loggedUser = req.user;

  const userFollow = await db.User.findOne({
    where: {
      username: username,
    },
  });

  if (!userFollow) {
    throw new ApiError(404, "User not found");
  }

  const currentUser = await db.User.findByPk(loggedUser.user_id);

  // {
  //   where: {
  //     user_id: loggedUser.user_id,
  //   },
  // }

  await userFollow.addFollower(currentUser);

  const profile = {
    username: username,
    // bio: user.dataValues.bio,
    image: userFollow.dataValues.image,
    following: true,
  };

  return res.status(200).json(new ApiResponse(200, { profile: profile }, ""));
});

const unFollowUser = asyncHandler(async (req, res, next) => {
  const username = req.params.username;
  const loggedUser = req.user;

  const userFollow = await db.User.findOne({
    where: {
      username: username,
    },
  });

  if (!userFollow) {
    throw new ApiError(404, "User not found");
  }

  const currentUser = await db.User.findByPk(loggedUser.user_id);

  // {
  //   where: {
  //     user_id: loggedUser.user_id,
  //   },
  // }

  await userFollow.removeFollower(currentUser);

  const profile = {
    username: username,
    // bio: user.dataValues.bio,
    image: userFollow.dataValues.image,
    following: false,
  };

  return res.status(200).json(new ApiResponse(200, { profile: profile }, ""));
});

module.exports = { getProfile, followUser, unFollowUser };
