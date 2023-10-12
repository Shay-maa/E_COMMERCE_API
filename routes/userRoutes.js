const express = require("express");

const {
  getValidator,
  createValidator,
  updateUserValidator,
  deleteUserValidator,
  changePasswordValidator,
  updateLoggedUserValidator,
} = require("../utils/validators/userValidator");
const {
  getUser,
  getUsers,
  createUser,
  updateUser,
  getLoggedUserData,
  changePassword,
  deleteUser,
  updateLoggedUserPassword,
  updateLoggedUserData,
  deleteLoggedUser,
  uploadUserImage,
  resizeImage,
} = require("../controllers/userController");

const AuthController = require("../controllers/authController");
const router = express.Router();

//user

router.use(AuthController.protect);

router.get("/getMe", getLoggedUserData, getUser);

router.put("/changeMyPassword", updateLoggedUserPassword);
router.put("/updateMe", updateLoggedUserValidator, updateLoggedUserData);
router.delete("/deleteMe", deleteLoggedUser);

//Admin
router.use(AuthController.allowedTo("admin"));

router.put("/changePassword/:id", changePasswordValidator, changePassword);

router
  .route("/")
  .get(getUsers)
  .post(uploadUserImage, resizeImage, createValidator, createUser);

router
  .route("/:id")
  .get(getValidator, getUser)
  .put(uploadUserImage, resizeImage, updateUserValidator, updateUser)
  .delete(deleteUserValidator, deleteUser);

module.exports = router;
