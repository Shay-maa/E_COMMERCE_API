const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const apiError = require("../utils/apiErrors");
const User = require("../models/userModel");
const ApiErrors = require("../utils/apiErrors");

const generateToken = (payload) =>
  jwt.sign({ userId: payload }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

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
  const currentUser = User.findById(decoded.userId);
  if (!currentUser) {
    return next(
      new ApiErrors(`The user that belong to this token does no longer exists`),
      401
    );
  }

  //4- check if user changes his password after token generated
});
