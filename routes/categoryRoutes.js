const express = require("express");

const AuthController = require("../controllers/authController");

const {
  getCategoryValidator,
  createCategoryValidator,
  updateCategoryValidator,
  deleteCategoryValidator,
} = require("../utils/validators/categoryValidator");

const {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
  uploadCategoryImage,
  resizeImage,
} = require("../controllers/categoryController");

const router = express.Router();
const subCategoryRoute = require("./subCategoryRoute");

router.use("/:categoryId/subcategories", subCategoryRoute);
router
  .route("/")
  .get(getCategories)
  .post(
    AuthController.protect,
    AuthController.allowedTo("admin", "manger"),
    uploadCategoryImage,
    resizeImage,
    createCategoryValidator,
    createCategory
  );
router
  .route("/:id")
  .get(getCategoryValidator, getCategory)
  .put(
    AuthController.protect,
    AuthController.allowedTo("admin", "manger"),
    uploadCategoryImage,
    resizeImage,
    updateCategoryValidator,
    updateCategory
  )
  .delete(
    AuthController.protect,
    AuthController.allowedTo("admin"),
    deleteCategoryValidator,
    deleteCategory
  );

module.exports = router;
