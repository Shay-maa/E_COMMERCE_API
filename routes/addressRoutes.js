const express = require("express");

const {
  addAddress,
  deleteAddress,
  getLoggedUserAddresses,
} = require("../controllers/addressController");
const AuthController = require("../controllers/authController");

const router = express.Router();

router.use(AuthController.protect, AuthController.allowedTo("user"));

router.route("/").post(addAddress).get(getLoggedUserAddresses);
router.route("/:addressId").delete(deleteAddress);

module.exports = router;
