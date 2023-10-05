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

const {
  getBrandValidator,
  createBrandVAlidator,
  updateBrandValidator,
  deleteBrandValidator,
} = require("../utils/validators/brandValidator");

const router = express.Router();

router.route("/").get(getBrands).post(uploadBrandImage, resizeImage ,createBrandVAlidator, createBrand);
router
  .route("/:id")
  .get(getBrandValidator, getBrand)
  .put(uploadBrandImage, resizeImage, updateBrandValidator, updateBrand)
  .delete(deleteBrandValidator, deleteBrand);


module.exports = router;
