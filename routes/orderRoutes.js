const express = require("express");

const {
  createCashOrder,
  getAllOrders,
  getSpecificOrder,
  filterOrderForLoggedUser,
  updateOrderDelivered,
  updateOrderPaid,
  checkoutSession,
} = require("../controllers/orderController");
const AuthController = require("../controllers/authController");
const router = express.Router();

router.use(AuthController.protect);

router.get("/checkout-session/:cartId", checkoutSession);

router.post("/:cartId", AuthController.allowedTo("user"), createCashOrder);

router.get(
  "/",
  AuthController.allowedTo("user", "admin", "manger"),
  filterOrderForLoggedUser,
  getAllOrders
);
router.get(
  "/:id",
  AuthController.allowedTo("user", "admin", "manger"),
  filterOrderForLoggedUser,
  getSpecificOrder
);
router
  .route("/:id/pay")
  .put(AuthController.allowedTo("admin", "manger"), updateOrderPaid);
router
  .route("/:id/deliver")
  .put(AuthController.allowedTo("admin", "manger"), updateOrderDelivered);

module.exports = router;
