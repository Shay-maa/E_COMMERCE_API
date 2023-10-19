const asyncHandler = require("express-async-handler");

const User = require("../models/userModel");

// @desc    add address to user addresses
// @route   POST /api/v1/addresses
// @access  protected/user
exports.addAddress = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $addToSet: { addresses: req.body },
    },
    { new: true }
  );
  res.status(200).json({
    status: "success",
    message: "address added successfully",
    data: user.addresses,
  });
});

// @desc    delete address
// @route   POST /api/v1/addresses/addressId
// @access  protected/user
exports.deleteAddress = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $pull: { addresses: { _id: req.params.addressId } },
    },
    { new: true }
  );
  res.status(200).json({
    status: "success",
    message: "address removed successfully",
    data: user.addresses,
  });
});

exports.getLoggedUserAddresses = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id).populate("addresses");

  res
    .status(200)
    .json({
      status: "success",
      results: user.addresses.length,
      data: user.addresses,
    });
});
