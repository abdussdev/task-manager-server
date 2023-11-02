// Import dependencies
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const router = require("./src/routes/api");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser")
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const hpp = require("hpp");
const mongoose = require("mongoose");

// Create an express app
const app = express();
app.use(express.json());


// Apply security middleware
app.use(cors());
app.use(helmet());
app.use(hpp());
app.use(mongoSanitize());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb" }));

// Parse request bodies
app.use(bodyParser.json());
app.use(cookieParser());

// Implement rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// Connect to the database
let URI = process.env.MONGODB;
let OPTIONS = {
  autoIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
  writeConcern: {
    w: "majority",
    j: true,
    wtimeout: 1000,
  },
};

mongoose
  .connect(URI, OPTIONS)
  .then(() => {
    console.log("Connected to the database");
  })
  .catch((error) => {
    console.error("Error connecting to the database", error);
  });

// Use the router for your routes
app.use("/api/v1", router);

// Handle undefined routes
app.use("*", (req, res) => {
  res.status(404).json({ status: "Fail", data: "Not found" });
});

module.exports = app;
