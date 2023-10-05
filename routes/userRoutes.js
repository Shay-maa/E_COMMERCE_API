const express = require("express");
const {
  getValidator,
  createValidator,
  updateUserValidator,
  deleteUserValidator,
  changePasswordValidator,
} = require("../utils/validators/userValidator");

const {
  getUser,
  getUsers,
  createUser,
  updateUser,
  changePassword,
  deleteUser,
  uploadUserImage,
  resizeImage,
} = require("../controllers/userController");

const router = express.Router();

router.put("/changepassword/:id", changePasswordValidator, changePassword);

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
