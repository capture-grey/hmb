// external imports
const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const path = require("path");
const cookieParser = require("cookie-parser");
const cors = require("cors");

// internal imports
const {
  notFoundHandler,
  errorHandler,
} = require("./middlewares/common/errorHandler");

const authRouter = require("./router/authRouter");
const roomRouter = require("./router/roomRouter");
const bookingRouter = require("./router/bookingRouter");

const app = express();
dotenv.config();

// database connection
mongoose
  .connect(process.env.MONGO_CONNECTION_STRING)
  .then(() => console.log("database connection successful!"))
  .catch((err) => console.log(err));

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://simplified-nb.vercel.app",
      "https://simplified-nb-rorshachs-projects-9fee91c2.vercel.app",
      "https://hotel-management-frontend-fawn.vercel.app",
      "https://hotel-management-frontend-git-main-rorshachs-projects-9fee91c2.vercel.app",
    ],
  })
);

// request parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// set static folder
app.use(express.static(path.join(__dirname, "public")));

// parse cookies
app.use(cookieParser(process.env.COOKIE_SECRET));

// routing setup
app.use("/api/auth", authRouter);
app.use("/api/rooms", roomRouter);
app.use("/api/bookings", bookingRouter);

app.get("/", (req, res) => {
  res.status(200).json({ message: "Hello From HMB" });
});

// 404 not found handler
app.use(notFoundHandler);

// common error handler
app.use(errorHandler);

app.listen(process.env.PORT, () => {
  console.log(`app listening to port ${process.env.PORT}`);
});

module.exports = app;
