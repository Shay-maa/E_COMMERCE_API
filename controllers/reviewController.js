const factory = require("./handlerFactory");
const Review = require("../models/reviewModel");

exports.setUserAndProductIdToBody = (req, res, next) => {
  if (!req.body.product) req.body.product = req.params.productId;
  if (!req.body.user) req.body.user = req.user._id;

  next();
};
// @desc     get all reviews
// @route    GET  /api/v1/reviews
// @access   public
exports.getReviews = factory.getAll(Review);

// @desc     get specific review
// @route    GET  /api/v1/reviews/:id
// @access   public
exports.getReview = factory.getOne(Review);

exports.createFilterObject = (req, res, next) => {
  let filterObjId = {};
  if (req.params.productId) filterObjId = { product: req.params.productId };

  req.filterObj = filterObjId;
  next();
};
// @desc     create review
// @route    POST  /api/v1/reviews
// @access   private/protected
exports.createReview = factory.create(Review);

// @desc     update review
// @route    PUT  /api/v1/reviews/:id
// @access   private/protected
exports.updateReview = factory.update(Review);

// @desc     delete review
// @route    DELETE  /api/v1/reviews/:id
// @access   private/protected
exports.deleteReview = factory.delete(Review);
