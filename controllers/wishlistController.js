const asyncHandler = require("express-async-handler");

const User = require("../models/userModel");

// @desc    add product to wishlist
// @route   POST /api/v1/wishlist
// @access  protected/user
exports.addProductToWishlist = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $addToSet: { wishlist: req.body.productId },
    },
    { new: true }
  );

  res.status(200).json({
    status: "success",
    message: "product added to your wishlist",
    data: user.wishlist,
  });
});

// @desc    remove product from wishlist
// @route   DELETE /api/v1/wishlist/:productId
// @access  protected/user
exports.removeProductFromWishlist = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $pull: { wishlist: req.params.productId },
    },
    { new: true }
  );

  res.status(200).json({
    status: "success",
    message: "product removed from your wishlist",
    data: user.wishlist,
  });
});

// @desc    get all products in wishlist
// @route   GET /api/v1/wishlist
// @access  protected/user

exports.getLoggedUserWishlist = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id).populate("wishlist");
  res
    .status(200)
    .json({
      status: "success",
      results: user.wishlist.length,
      data: user.wishlist,
    });
});
