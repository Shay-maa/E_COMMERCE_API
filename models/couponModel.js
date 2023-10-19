const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      unique: true,
      required: [true, "coupon name required"],
    },
    expire: {
      type: Date,
      required: [true, "Expired date is required"],
    },
    discountPercentage: {
      type: Number,
      required: [true, "discount percentage is required"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Coupon", couponSchema);
