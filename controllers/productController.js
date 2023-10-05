const asyncHandler = require("express-async-handler");

const { v4: uuidv4 } = require("uuid");
const sharp = require("sharp");

const Product = require("../models/productModel");
const factory = require("./handlerFactory");
const { uploadMixFields } = require("../middlewares/uploadImageMiddleware");

exports.uploadProductImages = uploadMixFields([
  { name: "imageCover", maxCount: 1 },
  { name: "images", maxCount: 5 },
]);

exports.resizeImages = asyncHandler(async (req, res, next) => {
  if (req.files.imageCover) {
    const imageCoverFileName = `Product-${uuidv4()}-${Date.now()}-cover.jpeg`;
    await sharp(req.files.imageCover[0].buffer)
      .resize(2000, 1333)
      .toFormat("jpeg")
      .jpeg({ quality: 95 })
      .toFile(`uploads/products/${imageCoverFileName}`);

    req.body.imageCover = imageCoverFileName;
  }
  if (req.files.images) {
    req.body.images = [];
    await Promise.all(
      //if we did't use await, array of images will be empty
      req.files.images.map(async (img, index) => {
        const imageName = `Product-${uuidv4()}-${Date.now()}-${index + 1}.jpeg`;
        await sharp(img.buffer)
          .resize(2000, 1333)
          .toFormat("jpeg")
          .jpeg({ quality: 95 })
          .toFile(`uploads/products/${imageName}`);
        req.body.images.push(imageName);
      })
    );
    console.log(req.body.images);
    next();
  }
});

// @desc    get list of products
// @route   GET /api/v1/products
// @access  public

exports.getProducts = factory.getAll(Product);

// @desc    get specific products
// @route   GET /api/v1/products/:id
// @access  public

exports.getProduct = factory.getOne(Product);

// @desc    create new product
// @route   POST /api/v1/products
// @access  private

exports.createProduct = factory.create(Product);

// @desc     update specific product
// @route    PUT /api/v1/products/:id
// @access   private

exports.updateProduct = factory.update(Product);
// @desc    delete specific product
// @route   DELETE /api/v1/products/:id
// @access  private

exports.deleteProduct = factory.delete(Product);
