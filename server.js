const path = require("path");

const express = require("express");
const morgan = require("morgan");
const dotenv = require("dotenv");

dotenv.config({ path: "config.env" });

const dbconnect = require("./config/dbConnect");

//routes
const mountRoutes = require("./routes/index");

const ApiError = require("./utils/apiErrors");
const globalError = require("./middlewares/ErrorMiddleware");

dbconnect();

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, "uploads")));

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
//Mount Routes
mountRoutes(app);

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
