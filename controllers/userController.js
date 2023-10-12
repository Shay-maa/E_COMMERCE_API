const asyncHandler = require("express-async-handler");
const sharp = require("sharp");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcryptjs");

const { uploadSingleImage } = require("../middlewares/uploadImageMiddleware");
const User = require("../models/userModel");
const factory = require("./handlerFactory");
const ApiErrors = require("../utils/apiErrors");
const generateToken = require("../utils/generateToken");
exports.uploadUserImage = uploadSingleImage("profileImg");

exports.resizeImage = asyncHandler(async (req, res, next) => {
  const fileName = `user-${uuidv4()}-${Date.now()}-.jpeg`;
  if (req.file) {
    await sharp(req.file.buffer)
      .resize(500, 500)
      .toFormat("jpeg")
      .jpeg({ quality: 95 })
      .toFile(`uploads/users/${fileName}`);
    req.body.profileImg = fileName;
  }

  next();
});
// @desc     create new user
// @route    POST /api/v1/users
// @access   private
exports.createUser = factory.create(User);

// @desc     get all users
// @route    GET /api/v1/users
// @access   private/admin
exports.getUsers = factory.getAll(User);

// @desc     get specific user
// @route    GET /api/v1/users/:id
// @access   private/admin
exports.getUser = factory.getOne(User);

// @desc     update specific user
// @route    PUT  /api/v1/users/:id
// @access   private/admin
exports.updateUser = asyncHandler(async (req, res, next) => {
  const document = await User.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      slug: req.body.slug,
      email: req.body.email,
      role: req.body.role,
      profileImg: req.body.profileImg,
      phone: req.body.phone,
      active: req.body.active,
    },
    { new: true }
  );
  if (!document) {
    return next(
      new ApiErrors(`No such document with id ${req.params.id}`, 404)
    );
  }
  res.status(200).json({ data: document });
});

// @desc      change user password
// @route     PUT  /api/v1/users/changePassword/:id
// @access    private
exports.changePassword = asyncHandler(async (req, res, next) => {
  const document = await User.findByIdAndUpdate(
    req.params.id,
    {
      password: await bcrypt.hash(req.body.password, 12),
      passChangedAt: Date.now(),
    },
    { new: true }
  );
  if (!document) {
    return next(
      new ApiErrors(`No such document with id ${req.params.id}`, 404)
    );
  }
  res.status(200).json({ data: document });
});
// @desc     delete specific user
// @route    DELETE /api/v1/users/:id
// @access   private/admin
exports.deleteUser = factory.delete(User);

// @desc     get logged user
// @route    GET /api/v1/users/getMe
// @access   private/protected
exports.getLoggedUserData = asyncHandler(async (req, res, next) => {
  req.params.id = req.user._id;
  next();
});

// @desc    update logged user password
// @route   PUT  /api/v1/users/changeMyPassword
// @access  private/protected
exports.updateLoggedUserPassword = asyncHandler(async (req, res, next) => {
  // 1) find user
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      password: await bcrypt.hash(req.body.password, 12),
      passChangedAt: Date.now(),
    },
    { new: true }
  );

  // 2)generate token
  console.log(user._id);

  const token = generateToken(user._id);
  res.status(200).json({ data: user, token });
});

// @desc    update logged user data
// @route   PUT  /api/v1/users/updateMe
// @access  private/protected
exports.updateLoggedUserData = asyncHandler(async (req, res, next) => {
  const updatedUser = await User.findByIdAndUpdate(
    req.user._id,
    {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
    },
    { new: true }
  );

  res.status(200).json({ data: updatedUser });
});

// @desc    deactivate logged user data
// @route   DELETE  /api/v1/users/deleteMe
// @access  private/protected

exports.deleteLoggedUser = asyncHandler(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user._id, {
    active: false,
  });

  res.status(204).json({ message: "success" });
});
