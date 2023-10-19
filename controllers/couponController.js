const asyncHandler = require("express-async-handler");

const factory = require("./handlerFactory");
const Coupon = require("../models/couponModel");

// @desc    create new coupon
// @route   POST /api/v1/coupons
// @access  private/admin-manger
exports.createCoupon = factory.create(Coupon);

// @desc    get all coupons
// @route   GET /api/v1/coupons
// @access  private/admin-manger
exports.getAllCoupons = factory.getAll(Coupon);

// @desc    get specific coupon
// @route   GET /api/v1/coupons/:couponId
// @access  private/admin-manger
exports.getOneCoupon = factory.getOne(Coupon);

// @desc    update specific coupon
// @route   PUT /api/v1/coupons/:couponId
// @access  private/admin-manger
exports.updateCoupon = factory.update(Coupon);

// @desc    delete specific coupon
// @route   DELETE /api/v1/coupons/:couponId
// @access  private/admin-manger
exports.deleteCoupon = factory.delete(Coupon);
