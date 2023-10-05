const slugify = require("slugify");
const Brand = require("../models/brandsModel");
const factory = require("./handlerFactory");
const { v4: uuidv4 } = require("uuid");
const { uploadSingleImage } = require("../middlewares/uploadImageMiddleware");
const sharp = require("sharp");
const asyncHandler = require("express-async-handler");

// @desc    get list of brands
// @rout    GET  /api/v1/brands
// @access  public
exports.uploadBrandImage = uploadSingleImage("image");

exports.resizeImage = asyncHandler(async (req, res, next) => {
  const fileName = `Brand-${uuidv4()}-${Date.now()}.jpeg`;
  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat("jpeg")
    .jpeg({ quality: 95 })
    .toFile(`uploads/brands/${fileName}`);
  req.body.image = fileName;
  next();
});

exports.getBrands = factory.getAll(Brand);

//  @desc    get specific brand
//  @rout    GET  /api/v1/brands/:id
//  @access  public

exports.getBrand = factory.getOne(Brand);

// @desc     create a brand
// @route    POST  /api/v1/brands/:id
// @access   private
exports.createBrand = factory.create(Brand);

// @desc     update specific brand
// @route    PUT /api/v1/brands/:id
// @access   private
exports.updateBrand = factory.update(Brand);

// @desc    delete specific category
// @route   DELETE /api/v1/categories/:id
// @access  private

exports.deleteBrand = factory.delete(Brand);
