const crypto = require("crypto");

const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const apiError = require("../utils/apiErrors");
const User = require("../models/userModel");
const ApiErrors = require("../utils/apiErrors");
const sendEmail = require("../utils/sendEmail");
const generateToken = require("../utils/generateToken");

// @desc     signup
// @route    POST /api/v1/auth/signup
// @access   public
exports.signup = asyncHandler(async (req, res, next) => {
  // create user
  const user = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  });

  //generate token
  const token = generateToken(user._id);
  res.status(201).json({ data: user, token });
});

// @desc     login
// @route    POST /api/v1/auth/login
// @access   public
exports.login = asyncHandler(async (req, res, next) => {
  // check if user exist & check if password correct
  const user = await User.findOne({ email: req.body.email });

  if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
    return next(new apiError(`Incorrect Email or password`, 401));
  }

  const token = generateToken(user._id);

  res.status(201).json({ data: user, token });
});

// @desc     make sure the user is logged in

exports.protect = asyncHandler(async (req, res, next) => {
  //1- fetch the token

  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    return next(
      new ApiErrors(`You are not login, please login to get access`, 401)
    );
  }
  //2- verify token (no change happen , expired token)
  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY); // will return userId and if expired token

  //3- check if the user exists
  console.log(decoded.userId);
  const currentUser = await User.findById(decoded.userId);
  if (!currentUser) {
    return next(
      new ApiErrors(
        `The user that belong to this token does no longer exists`,
        401
      )
    );
  }
  //4- check if user changes his password after token generated
  if (currentUser.passChangedAt) {
    const passChangedTimestamp = parseInt(
      currentUser.passChangedAt.getTime() / 1000,
      10
    );
    if (passChangedTimestamp > decoded.iat) {
      return next(
        new ApiErrors(
          "User recently changed his password. please login again..",
          401
        )
      );
    }
  }
  console.log(currentUser.name);
  req.user = currentUser;
  next();
});

exports.allowedTo = (...roles) =>
  asyncHandler(async (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ApiErrors("You are not allowed to access this route", 403)
      );
    }
    next();
  });

exports.forgotPassword = asyncHandler(async (req, res, next) => {
  //get user by email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new ApiErrors("There is no user with such email", 404));
  }

  //if user exist, generate hash reset random 6 digits and save it in db
  const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
  const hashedResetCode = crypto
    .createHash("sha256")
    .update(resetCode)
    .digest("hex");
  user.passwordResetCode = hashedResetCode;

  //add expiration time for password reset code (10min)
  user.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  user.passwordResetVerified = false;

  await user.save();

  // send the reset code via email

  const message = `Hi ${user.name}, \n  We received a request to reset the password on your E-shop Account. \n ${resetCode} \n Enter this code to complete the reset. \n Thanks for helping us keep your account secure.\n The E-shop Team`;
  try {
    await sendEmail({
      email: user.email,
      subject: "Your Password Reset Code (valid for 10 min)",
      message,
    });
  } catch (error) {
    passwordResetCode = undefined;
    passwordResetExpires = undefined;
    passwordResetVerified = undefined;

    await user.save();
    return next(new ApiErrors("There is an error in sending email", 500));
  }

  res
    .status(200)
    .json({ status: "success", message: "Reset code sent to email" });
});

// @desc    Verify password reset code
// @route   POST  /api/v1/auth/verifyResetCode
// @access  Public

exports.verifyResetCode = asyncHandler(async (req, res, next) => {
  // 1) get user based on reset code
  const hashedResetCode = crypto
    .createHash("sha256")
    .update(req.body.resetCode)
    .digest("hex");

  const user = await User.findOne({
    passwordResetCode: hashedResetCode,
    passwordResetExpires: { $gt: Date.now() },
  });
  if (!user) {
    return next(ApiErrors("Reset code invalid or expired", 400));
  }

  // 2) Reset code valid
  user.passwordResetVerified = true;
  await user.save();

  res.status(200).json({ status: "Success" });
});

// @desc    Reset password
// @rout    PUT /api/v1/auth/resetPassword
// @access  public

exports.resetPassword = asyncHandler(async (req, res, next) => {
  //1)get user based on email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new ApiErrors("There is no user with this email", 404));
  }

  // 2) check if reset code verified
  if (!user.passwordResetVerified) {
    return next(new ApiErrors("Reset code not verified", 400));
  }

  user.password = req.body.newPassword;

  user.passwordResetCode = undefined;
  user.passwordResetExpires = undefined;
  user.passwordResetVerified = undefined;

  await user.save();

  // 3) if everything is ok, generate token
  const token = generateToken(user._id);
  res.status(200).json({ token });
});
