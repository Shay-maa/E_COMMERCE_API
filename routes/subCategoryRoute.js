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

const {
  createsubCategoryValidator,
  getsubCategoryValidator,
  updatesubCategoryValidator,
  deletesubCategoryValidator,
} = require("../utils/validators/subCategoryValidator");

// mergeParams: Allow us to access parameters on other routes
const router = express.Router({mergeParams:true});

router
  .route("/")
  .post(setCategoryToBody, createsubCategoryValidator, createSubCategory)
  .get(createFilterObject , getSubCategories);
router
  .route("/:id")
  .get(getsubCategoryValidator, getSubCategory)
  .put(updatesubCategoryValidator, updateSubCategory)
  .delete(deletesubCategoryValidator ,deleteSubCategory);

module.exports = router;
