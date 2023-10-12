const express = require("express");
const {
  getBrand,
  getBrands,
  createBrand,
  updateBrand,
  deleteBrand,
  uploadBrandImage,
  resizeImage,
} = require("../controllers/brandController");
const AuthController = require("../controllers/authController");

const {
  getBrandValidator,
  createBrandVAlidator,
  updateBrandValidator,
  deleteBrandValidator,
} = require("../utils/validators/brandValidator");

const router = express.Router();

router
  .route("/")
  .get(getBrands)
  .post(
    AuthController.protect,
    AuthController.allowedTo("admin", "manger"),
    uploadBrandImage,
    resizeImage,
    createBrandVAlidator,
    createBrand
  );
router
  .route("/:id")
  .get(getBrandValidator, getBrand)
  .put(
    AuthController.protect,
    AuthController.allowedTo("admin", "manger"),
    uploadBrandImage,
    resizeImage,
    updateBrandValidator,
    updateBrand
  )
  .delete(
    AuthController.protect,
    AuthController.allowedTo("admin"),
    deleteBrandValidator,
    deleteBrand
  );

module.exports = router;
