const express = require("express");
const router = express.Router({ mergeParams: true });

const {
  getReview,
  getReviews,
  createReview,
  updateReview,
  deleteReview,
  setUserAndProductIdToBody,
  createFilterObject,
} = require("../controllers/reviewController");

const {
  createReviewValidator,
  getReviewValidator,
  updateReviewValidator,
  deleteReviewValidator,
} = require("../utils/validators/reviewValidator");

const AuthController = require("../controllers/authController");

router
  .route("/")
  .get(createFilterObject, getReviews)
  .post(
    AuthController.protect,
    AuthController.allowedTo("user"),
    setUserAndProductIdToBody,
    createReviewValidator,
    createReview
  );
router
  .route("/:id")
  .get(getReviewValidator, getReview)
  .put(
    AuthController.protect,
    AuthController.allowedTo("user"),
    updateReviewValidator,
    updateReview
  )
  .delete(
    AuthController.protect,
    AuthController.allowedTo("admin", "manger", "user"),
    deleteReviewValidator,
    deleteReview
  );

module.exports = router;
