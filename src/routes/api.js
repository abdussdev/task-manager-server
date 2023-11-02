const express = require("express");
const userController = require("../controllers/userController");

const router = express.Router();

// User routes
router.post("/register", userController.register);
router.post("/resend-otp", userController.resendOTP)
router.post("/verify-email", userController.verifyEmail);
router.post("/login", userController.login);
router.get("/read-profile", userController.readProfile);
router.put("/update-profile", userController.updateProfile);
router.delete("/delete-profile", userController.deleteProfile);

// Task routes


module.exports = router;
