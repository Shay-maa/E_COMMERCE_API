const path = require("path");

const express = require("express");
const morgan = require("morgan");
const dotenv = require("dotenv");

dotenv.config({ path: "config.env" });

const dbconnect = require("./config/dbConnect");

//routes
const categoryRoute = require("./routes/categoryRoutes");
const subCategoryRoute = require("./routes/subCategoryRoute");
const brandRoute = require("./routes/brandRoutes");
const productRoute = require("./routes/productRoutes");
const userRoute = require("./routes/userRoutes");
const authRoute = require("./routes/authRoutes");
const reviewRoute = require("./routes/reviewRoutes");
const wishlistRoute = require("./routes/wishlistRoutes");
const addressRoute = require("./routes/addressRoutes");

const ApiError = require("./utils/apiErrors");
const globalError = require("./middlewares/ErrorMiddleware");

dbconnect();

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, "uploads")));

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use("/api/v1/categories", categoryRoute);
app.use("/api/v1/subcategories", subCategoryRoute);
app.use("/api/v1/brands", brandRoute);
app.use("/api/v1/products", productRoute);
app.use("/api/v1/users", userRoute);
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/reviews", reviewRoute);
app.use("/api/v1/wishlist", wishlistRoute);
app.use("/api/v1/addresses", addressRoute);
//handel the unknown routes
app.all("*", (req, res, next) => {
  next(new ApiError(`Can't find this route ${req.originalUrl}`, 400));
});

//global handle errors for express
app.use(globalError);

const PORT = process.env.PORT || 8000;

const server = app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});

//handle rejections outside express
process.on("unhandledRejection", (err) => {
  console.error(`Unhandled Rejection at: ${err.message} | ${err.stack}`);
  server.close(() => {
    console.error("Server shutting down....");
    process.exit(1);
  });
});
