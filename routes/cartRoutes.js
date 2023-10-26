const express = require("express");

const {
  addProductToCart,
  getLoggedUserCart,
  removeItemFromCart,
  deleteUserCar,
  updateCartItemQuantity,
  applyCouponToCart,
} = require("../controllers/cartController");
const AuthController = require("../controllers/authController");

const router = express.Router();

router.use(AuthController.protect, AuthController.allowedTo("user"));
router
  .route("/")
  .post(addProductToCart)
  .get(getLoggedUserCart)
  .delete(deleteUserCar);
router.route("/:itemId").put(updateCartItemQuantity).delete(removeItemFromCart);
router.route("/applyCoupon").put(applyCouponToCart);
module.exports = router;
