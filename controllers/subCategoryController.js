const SubCategory = require("../models/subCategoryModel");
const factory = require("./handlerFactory");

exports.setCategoryToBody = (req, res, next) => {
  if (!req.body.category) req.body.category = req.params.categoryId;
  next();
};

// @desc    create new subCategory
// @route   POST /api/v1/subcategories
// @access  private

exports.createSubCategory = factory.create(SubCategory);

exports.createFilterObject = (req, res, next) => {
  let filterObjectId = {};
  if (req.params.categoryId)
    filterObjectId = { category: req.params.categoryId };
  req.filterObj = filterObjectId;
  next();
};

// @desc    get list of subCategories
// @route   GET /api/v1/subCategories
// @access  public

exports.getSubCategories = factory.getAll(SubCategory);
// @desc    get specific subCategories
// @route   GET /api/v1/subcategories/:id
// @access  public
exports.getSubCategory = factory.getOne(SubCategory);
// @desc     update specific subCategory
// @route    PUT /api/v1/subcategories/:id
// @access   private

exports.updateSubCategory = factory.update(SubCategory);

// @desc    delete specific subCategory
// @route   DELETE /api/v1/subcategories/:id
// @access  private

exports.deleteSubCategory = factory.delete(SubCategory);
