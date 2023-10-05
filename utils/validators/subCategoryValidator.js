const { check , body } = require("express-validator");
const validator = require("../../middlewares/validatorMiddleware");
const slugify = require("slugify");


exports.getsubCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid subCategory Id formate"),
  validator,
];
exports.createsubCategoryValidator = [
  check("name")
    .notEmpty()
    .withMessage("subCategory name required")
    .isLength({ min: 2 })
    .withMessage("Too short subCategory name")
    .isLength({ max: 36 })
    .withMessage("Too long subCategory name"),
  check("category")
    .notEmpty()
    .withMessage("subCategory must belong to category")
    .isMongoId()
    .withMessage("Invalid Category id format")
    .custom((val, { req }) => {
    req.body.slug = slugify(val);
    return true;
  }),
  validator,
];

exports.updatesubCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid subCategory Id formate"),
  body("name").custom((val, { req }) => {
    req.body.slug = slugify(val);
    return true;
  }),
  validator,
];

exports.deletesubCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid subCategory Id formate"),
  validator,
];
