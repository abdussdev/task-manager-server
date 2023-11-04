const express = require("express");
const userController = require("../controllers/userController");
const taskController = require("../controllers/taskController");
const authVerify = require("../middlewares/authVerify");

const router = express.Router();

// User routes
router.post("/register", userController.register);
router.post("/resend-otp", userController.resendOTP);
router.post("/verify-email/:email/:otp", userController.verifyEmail);
router.post("/login", userController.login);
router.post("/change-password", authVerify, userController.changePassword);
router.get("/read-profile", authVerify, userController.readProfile);
router.put("/update-profile", authVerify, userController.updateProfile);
router.delete("/delete-profile", authVerify, userController.deleteProfile);

// Task routes
router.post("/create-task", authVerify, taskController.createTask);
router.put("/update-task/:taskId", authVerify, taskController.updateTask);
router.put("/update-task-status/:taskId", authVerify, taskController.updateTaskStatus);
router.get("/read-all-task", authVerify, taskController.readAllTask);
router.get("/read-task/:taskId", authVerify, taskController.readSingleTask);
router.delete("/delete-task/:taskId", authVerify, taskController.deleteTask);

module.exports = router;
