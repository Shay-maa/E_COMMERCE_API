const { check, body } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");
const Category = require("../../models/categoryModel");
const Subcategory = require("../../models/subCategoryModel");
const slugify = require("slugify");

exports.createProductValidator = [
  check("title")
    .notEmpty()
    .withMessage("product title is required")
    .isLength({ min: 3 })
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    })
    .withMessage("Too short product title"),
  check("description")
    .notEmpty()
    .withMessage("Product description is required")
    .isLength({ max: 2000 })
    .withMessage("product description is too long"),
  check("quantity")
    .isNumeric()
    .withMessage("quantity must be number")
    .notEmpty()
    .withMessage("product quantity is required"),
  check("sold")
    .optional()
    .isNumeric()
    .withMessage("product quantity must be number"),
  check("price")
    .notEmpty()
    .withMessage("product price is required")
    .isNumeric()
    .withMessage("product must be a number")
    .isLength({ max: 32 })
    .withMessage("Too long price"),
  check("priceAfterDiscount")
    .optional()
    .isNumeric()
    .withMessage("product price must be a number")
    .toFloat()
    .custom((value, { req }) => {
      if (req.body.price < value) {
        throw new Error(
          "Price after discount cannot be less than current price"
        );
      }
      return true;
    }),
  check("colors")
    .optional()
    .isArray()
    .withMessage("colors should be array of string"),
  check("imageCover").notEmpty().withMessage("product image cover is required"),
  check("images")
    .optional()
    .isArray()
    .withMessage("images should be array of string"),
  check("category")
    .notEmpty()
    .withMessage("Product must be belong to a category ")
    .isMongoId()
    .withMessage("Invalid Id formate")
    .custom((categoryId) =>
      Category.findById(categoryId).then((category) => {
        if (!category) {
          return Promise.reject(
            new Error(`No category for this id:${categoryId}`)
          );
        }
      })
    ),

  check("subcategories")
    .optional()
    .isMongoId()
    .withMessage("Invalid Id formate")
    .custom((subcategoriesIds) => {
      Subcategory.find({ _id: { $exists: true, $in: subcategoriesIds } }).then(
        (result) => {
          if (
            result.isLength < 1 ||
            result.length !== subcategoriesIds.length
          ) {
            return Promise.reject(new Error(`Invalid subcategories Ids`));
          }
        }
      );
    })
    .custom((val, { req }) => {
      Subcategory.find({ category: req.body.Category }).then(
        (subcategories) => {
          const subCategoriesInDB = [];
          subcategories.forEach((subcategory) => {
            subCategoriesInDB.push(String(subcategory._id));
          });
          const checker = (target, arr) => target.every((v) => arr.include(v));
          if (!checker(val, subCategoriesInDB)) {
            return Promise.reject(
              new Error(`subcategories not belong to category`)
            );
          }
        }
      );
    }),

  check("brand").optional().isMongoId().withMessage("Invalid Id formate"),
  check("ratingsAverage")
    .optional()
    .isNumeric()
    .withMessage("ratings Average must be a number")
    .isLength({ min: 1 })
    .withMessage("Rating must be above or equal 1.0")
    .isLength({ max: 5 })
    .withMessage("Rating must be below or equal 5.0"),
  check("ratingsQuantity")
    .optional()
    .isNumeric()
    .withMessage("ratings Quantity must be a number"),

  validatorMiddleware,
];

exports.getProductValidator = [
  check("id").isMongoId().withMessage("Invalid Id formate"),
  validatorMiddleware,
];

exports.updateProductValidator = [
  check("id").isMongoId().withMessage("Invalid Id formate"),
  body("title")
    .optional()
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  validatorMiddleware,
];

exports.deleteProductValidator = [
  check("id").isMongoId().withMessage("Invalid Id formate"),
];
