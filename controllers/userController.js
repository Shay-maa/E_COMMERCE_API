const asyncHandler = require("express-async-handler");
const sharp = require("sharp");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcryptjs");

const { uploadSingleImage } = require("../middlewares/uploadImageMiddleware");
const User = require("../models/userModel");
const factory = require("./handlerFactory");
const ApiErrors = require("../utils/apiErrors");

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
// @access   private
exports.getUsers = factory.getAll(User);

// @desc     get specific user
// @route    GET /api/v1/users/:id
// @access   private
exports.getUser = factory.getOne(User);

// @desc     update specific user
// @route    PUT  /api/v1/users/:id
// @access   private
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
// @route     PUT  /api/v1/users/changepassword/:id
// @access    private
exports.changePassword = asyncHandler(async (req, res, next) => {
  const document = await User.findByIdAndUpdate(
    req.params.id,
    { password: await bcrypt.hash(req.body.password, 12) },
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
// @access   private
exports.deleteUser = factory.delete(User);
