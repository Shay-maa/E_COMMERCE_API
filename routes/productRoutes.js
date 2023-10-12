const express = require("express");

const {
  getProduct,
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadProductImages,
  resizeImages,
} = require("../controllers/productController");
const AuthController = require("../controllers/authController");

const {
  getProductValidator,
  createProductValidator,
  updateProductValidator,
  deleteProductValidator,
} = require("../utils/validators/productValidator");

const router = express.Router();

router
  .route("/")
  .get(getProducts)
  .post(
    AuthController.protect,
    AuthController.allowedTo("admin", "manger"),
    uploadProductImages,
    resizeImages,
    createProductValidator,
    createProduct
  );
router
  .route("/:id")
  .get(getProductValidator, getProduct)
  .put(
    AuthController.protect,
    AuthController.allowedTo("admin", "manger"),
    uploadProductImages,
    resizeImages,
    updateProductValidator,
    updateProduct
  )
  .delete(
    AuthController.protect,
    AuthController.allowedTo("admin"),
    deleteProductValidator,
    deleteProduct
  );

module.exports = router;
