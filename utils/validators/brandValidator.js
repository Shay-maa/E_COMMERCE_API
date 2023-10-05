const { check , body} = require("express-validator");
const validator = require("../../middlewares/validatorMiddleware");
const slugify = require("slugify");

exports.getBrandValidator = [
  check("id").isMongoId().withMessage("Invalid Brand Id formate"),
  validator,
];
exports.createBrandVAlidator = [
  check("name")
    .notEmpty()
    .withMessage("Brand name required")
    .isLength({ min: 2 })
    .withMessage("Too short Brand Name")
    .isLength({ max: 50 })
    .withMessage("Too Long Brand name").
    custom((val, { req }) => {
    req.body.slug = slugify(val);
    return true;
  }),
  validator,
];
exports.updateBrandValidator = [
  check("id").isMongoId().withMessage("Invalid Brand Id Formate"),
  body("name").optional().custom((val, { req }) => {
    req.body.slug = slugify(val);
    return true;
  }),
  validator,
];

exports.deleteBrandValidator = [
    check("id").isMongoId().withMessage("Invalid Brand Id Formate"), validator
];