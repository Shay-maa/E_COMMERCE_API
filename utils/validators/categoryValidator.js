const { check , body} = require("express-validator");
const validator = require("../../middlewares/validatorMiddleware");
const slugify = require("slugify");

exports.getCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid category Id formate"),
  validator,
];
exports.createCategoryValidator = [
  check("name")
    .notEmpty()
    .withMessage("Category name required")
    .isLength({ min: 2 })
    .withMessage("Too short category name")
    .isLength({ max: 36 })
    .withMessage("Too long category name")
    .custom((val, { req }) => {
    req.body.slug = slugify(val);
    return true;
  }),
  validator,
];

exports.updateCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid category Id formate"),
  body('name').optional().custom((val,{req})=>{
    req.body.slug = slugify(val)
    return true;
  }),
  validator,
];

exports.deleteCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid category Id formate"),
  validator,
];
