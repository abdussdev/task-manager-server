const express = require("express");
const userController = require("../controllers/userController");
const authVerify = require("../middlewares/authVerify");

const router = express.Router();

// User routes
router.post("/register", userController.register);
router.post("/resend-otp", userController.resendOTP);
router.post("/verify-email/:email/:otp", userController.verifyEmail);
router.post("/login", userController.login);
router.get("/read-profile", authVerify, userController.readProfile);
router.put("/update-profile", authVerify, userController.updateProfile);
router.delete("/delete-profile", authVerify, userController.deleteProfile);

// Task routes

module.exports = router;
