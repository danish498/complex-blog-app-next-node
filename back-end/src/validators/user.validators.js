const { body, param } = require("express-validator");

const userRegisterValidator = () => {
  return [
    body("email")
      .trim()
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Email is invalid"),
    body("password").notEmpty().withMessage("Password is required"),
    // body("username")
    //   .trim()
    //   .notEmpty()
    //   .withMessage("Username is required")
    //   .isLowercase()
    //   .withMessage("Username must be lowercase")
    //   .isLength({ min: 3 })
    //   .withMessage("Username must be at lease 3 characters long"),
    // body("password").trim().notEmpty().withMessage("Password is required"),
  ];
};

const userLoginValidator = () => {
  return [
    body("username").optional(),
    body("password").notEmpty().withMessage("Password is required"),
  ];
};

const userChangeCurrentPasswordValidator = () => {
  return [
    body("oldPassword").notEmpty().withMessage("Old password is required"),
    body("newPassword").notEmpty().withMessage("New password is required"),
  ];
};

const userForgotPasswordValidator = () => {
  return [
    body("email")
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Email is invalid"),
  ];
};

const userResetForgottenPasswordValidator = () => {
  return [body("newPassword").notEmpty().withMessage("Password is required")];
};

// const userAssignRoleValidator = () => {
//   return [
//     body("role")
//       .optional()
//       .isIn(AvailableUserRoles)
//       .withMessage("Invalid user role"),
//   ];
// };



module.exports = {
  userChangeCurrentPasswordValidator,
  userForgotPasswordValidator,
  userLoginValidator,
  userRegisterValidator,
  userResetForgottenPasswordValidator,
};

// module.exports = {
//   validateUser,
// };