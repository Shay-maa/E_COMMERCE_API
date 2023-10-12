const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "name required"],
      trim: true,
    },
    slug: {
      type: String,
      lowercase: true,
    },
    email: {
      type: String,
      required: [true, "email required"],
      lowercase: true,
      unique: true,
    },
    phone: String,
    profileImg: String,
    password: {
      type: String,
      required: [true, "Password required"],
      minlength: [8, "Too short password"],
    },
    role: {
      type: String,
      enum: ["user", "admin", "manger"],
      default: "user",
    },
    passChangedAt: Date,
    passwordResetCode: String,
    passwordResetVerified: Boolean,
    passwordResetExpires: Date,
    active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 12);
  next();
});

module.exports = mongoose.model("User", userSchema);
