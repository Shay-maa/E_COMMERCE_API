const express = require("express");
const {
  createCoupon,
  getAllCoupons,
  getOneCoupon,
  updateCoupon,
  deleteCoupon,
} = require("../controllers/couponController");
const AuthController = require("../controllers/authController");

const router = express.Router();
router.use(AuthController.protect, AuthController.allowedTo("admin"));

router.route("/").post(createCoupon).get(getAllCoupons);
router.route("/:id").get(getOneCoupon).put(updateCoupon).delete(deleteCoupon);

module.exports = router;
