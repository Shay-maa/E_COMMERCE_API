const Category = require("../models/categoryModel");
const factory = require("./handlerFactory");
const asyncHandler = require("express-async-handler");
const { v4: uuidv4 } = require("uuid");
const sharp = require("sharp");
const { uploadSingleImage } = require("../middlewares/uploadImageMiddleware");

exports.uploadCategoryImage = uploadSingleImage("image");

exports.resizeImage = asyncHandler(async (req, res, next) => {
  const filename = `category-${uuidv4()}-${Date.now()}.jpeg`;
  if (req.file) {
    await sharp(req.file.buffer)
      .resize(600, 600)
      .toFormat("jpeg")
      .jpeg({ quality: 95 })
      .toFile(`uploads/category/${filename}`);
    req.body.image = filename;
  }
  next();
});

// @desc    get list of categories
// @route   GET /api/v1/categories
// @access  public
exports.getCategories = factory.getAll(Category);

// @desc    get specific categories
// @route   GET /api/v1/categories/:id
// @access  public
exports.getCategory = factory.getOne(Category);

// @desc    create new category
// @route   POST /api/v1/categories
// @access  private
exports.createCategory = factory.create(Category);

// @desc     update specific category
// @route    PUT /api/v1/categories/:id
// @access   private
exports.updateCategory = factory.update(Category);

// @desc    delete specific category
// @route   DELETE /api/v1/categories/:id
// @access  private
exports.deleteCategory = factory.delete(Category);
