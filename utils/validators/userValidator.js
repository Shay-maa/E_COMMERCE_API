const { check, body } = require("express-validator");
const { default: slugify } = require("slugify");
const bcrypt = require("bcryptjs");
const User = require("../../models/userModel");
const validator = require("../../middlewares/validatorMiddleware");

exports.createValidator = [
  check("name")
    .notEmpty()
    .withMessage("user name required")
    .isLength({ min: 2 })
    .withMessage("Too short user name")
    .isLength({ max: 50 })
    .withMessage("Too long user name")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  check("email")
    .notEmpty()
    .withMessage("email required")
    .isEmail()
    .withMessage("invalid email address")
    .custom((val) =>
      User.findOne({ email: val }).then((user) => {
        if (user) {
          return Promise.reject(new Error("E-mail already in use"));
        }
      })
    ),
  check("password")
    .notEmpty()
    .withMessage("password required")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 6 characters")
    .custom((password, { req }) => {
      if (password !== req.body.passwordConfirm) {
        throw new Error("Password conformation incorrect");
      }
      return true;
    }),
  check("passwordConfirm")
    .notEmpty()
    .withMessage("password confirmation required"),
  check("phone")
    .optional()
    .isMobilePhone("ar-EG")
    .withMessage("Invalid phone number only accepted Egypt Phone numbers"),

  check("profileImg").optional(),
  check("role").optional(),
  validator,
];

exports.getValidator = [
  check("id").isMongoId().withMessage("Invalid user Id formate"),
  validator,
];

exports.updateUserValidator = [
  check("id").isMongoId().withMessage("Invalid user Id Formate"),
  body("name")
    .optional()
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  check("email")
    .optional()
    .isEmail()
    .withMessage("invalid email address")
    .custom((val) => {
      User.findOne({ email: val }).then((user) => {
        if (user) {
          return Promise.reject(new Error("E-mail already in use"));
        }
      });
    }),
  check("phone")
    .optional()
    .isMobilePhone("ar-EG")
    .withMessage("Invalid phone number only accepted Egypt Phone numbers"),

  check("profileImg").optional(),
  check("role").optional(),
  validator,
];

exports.changePasswordValidator = [
  check("id").isMongoId().withMessage("Invalid user id format"),
  body("currentPassword").notEmpty().withMessage("current password required"),
  body("passwordConfirm")
    .notEmpty()
    .withMessage("password confirmation is required"),
  body("password")
    .notEmpty()
    .withMessage("user password required")
    .custom(async (password, { req }) => {
      const user = await User.findById(req.params.id);
      if (!user) {
        throw new Error(`No found user with this id ${req.params.id}`);
      }
      const isCorrectPassword = await bcrypt.compare(
        req.body.currentPassword,
        user.password
      );
      if (!isCorrectPassword) {
        throw new Error(`Incorrect current password`);
      }
      if (password !== req.body.passwordConfirm) {
        throw new Error("password confirmation incorrect");
      }
      return true;
    }),
  validator,
];

exports.deleteUserValidator = [
  check("id").isMongoId().withMessage("Invalid User Id Formate"),
  validator,
];
