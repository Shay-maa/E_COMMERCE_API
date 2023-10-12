const express = require("express");

const {
  createSubCategory,
  getSubCategory,
  getSubCategories,
  updateSubCategory,
  deleteSubCategory,
  setCategoryToBody,
  createFilterObject,
} = require("../controllers/subCategoryController");
const AuthController = require("../controllers/authController");

const {
  createsubCategoryValidator,
  getsubCategoryValidator,
  updatesubCategoryValidator,
  deletesubCategoryValidator,
} = require("../utils/validators/subCategoryValidator");

// mergeParams: Allow us to access parameters on other routes
const router = express.Router({ mergeParams: true });

router
  .route("/")
  .post(
    AuthController.protect,
    AuthController.allowedTo("admin", "manger"),
    setCategoryToBody,
    createsubCategoryValidator,
    createSubCategory
  )
  .get(createFilterObject, getSubCategories);
router
  .route("/:id")
  .get(getsubCategoryValidator, getSubCategory)
  .put(
    AuthController.protect,
    AuthController.allowedTo("admin", "manger"),
    updatesubCategoryValidator,
    updateSubCategory
  )
  .delete(
    AuthController.protect,
    AuthController.allowedTo("admin"),
    deletesubCategoryValidator,
    deleteSubCategory
  );

module.exports = router;
