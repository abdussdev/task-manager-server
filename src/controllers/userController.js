const User = require("../models/userModel");
const transporter = require("../utilities/emailTransporter");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

exports.register = async (req, res) => {
  try {
    const userData = req.body;
    const email = userData.email;
    const password = userData.password;
    const otp = Math.floor(100000 + Math.random() * 900000);

    // Check if the email already exists in the database
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        error:
          "This email is already registered. Please use a different email address.",
      });
    }

    // Hash the password using bcrypt
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Email data
    const mailOptions = {
      from: "Abdus Samad <abdusjscript@gmail.com>",
      to: email,
      subject: "OTP Verification",
      text: `Your OTP (One-Time Password) for verification is: ${otp}`,
    };

    // Send the OTP email using the imported transporter
    try {
      const info = await transporter.sendMail(mailOptions);
      console.log("Email sent: " + info.response);

      const user = await User.create({
        ...userData,
        password: hashedPassword,
        otp,
      });

      // Return a success message
      res.status(200).json({ message: "OTP sent successfully" });
    } catch (error) {
      console.error("Error sending email or updating user with OTP: ", error);
      res
        .status(500)
        .json({ error: "Could not send OTP email or update user with OTP" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Registration failed: " + error.message });
  }
};

exports.resendOTP = async (req, res) => {
  try {
    const email = req.body.email;
    const otp = Math.floor(100000 + Math.random() * 900000);

    // Email data
    const mailOptions = {
      from: "Abdus Samad <abdusjscript@gmail.com>",
      to: email,
      subject: "Resend OTP Verification",
      text: `Your new OTP (One-Time Password) for verification is: ${otp}`,
    };

    // Send the OTP email using the imported transporter
    try {
      const info = await transporter.sendMail(mailOptions);
      console.log("Resent OTP email: " + info.response);

      // Update the user's OTP in the database
      await User.updateOne({ email: email }, { otp: otp });

      // Return a success message
      res.status(200).json({ message: "New OTP sent successfully" });
    } catch (error) {
      console.error(
        "Error resending OTP or updating user with new OTP: ",
        error
      );
      res.status(500).json({
        error: "Could not resend OTP email or update user with new OTP",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Resending OTP failed" });
  }
};

exports.verifyEmail = async (req, res) => {
  try {
    const email = req.params.email;
    const otp = req.params.otp;

    const user = await User.findOne({ email });

    if (!user || user.otp !== otp) {
      return res.status(401).json({ message: "User verification failed" });
    }

    // Set the OTP to null
    await User.updateOne({ email: email }, { otp: null });

    // Respond with the token
    res.json({ user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could not verify user" });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if the user with the given username exists in the database
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        error: "Invalid credentials. Please check your username and password.",
      });
    }

    // Compare the provided password with the hashed password in the database
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({
        error: "Invalid credentials. Please check your username and password.",
      });
    }

    const tokenPayload = {
      userId: user._id,
      name: user.name,
      email: user.email,
    };

    const secretKey = "SecretKeyForJWT123";

    const token = jwt.sign(tokenPayload, secretKey, {
      expiresIn: "1d",
    });

    // Respond with the token
    res.json({ token, user });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({
      error:
        "An error occurred while processing the login request: " +
        error.message,
    });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { currentPassword, newPassword } = req.body;

    // Find the user by ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Compare the current password provided with the stored hashed password
    const isPasswordMatch = await bcrypt.compare(currentPassword, user.password);

    if (!isPasswordMatch) {
      return res.status(400).json({ error: 'Current password is incorrect' });
    }

    // Hash the new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password
    user.password = hashedNewPassword;
    await user.save();

    res.status(200).json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.readProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    if (!userId) {
      return res.status(400).json({ error: "Missing userId in the request" });
    }

    const userProfile = await User.findOne({ userId });
    if (!userProfile) {
      return res.status(404).json({ error: "Profile not found" });
    }

    res.status(200).json(userProfile);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const profileData = req.body;

    if (!userId) {
      return res.status(400).json({ error: "Missing userId in the request" });
    }

    const userProfile = await User.findOneAndUpdate({ userId }, profileData, {
      new: true,
    });
    if (!userProfile) {
      return res.status(404).json({ error: "Profile not found" });
    }

    res.status(200).json({ message: "Profile updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.deleteProfile = async (req, res) => {
  try {
    const userId = req.user.userId;

    if (!userId) {
      return res.status(400).json({ error: "Missing userId in the request" });
    }

    const userProfile = await User.findOneAndDelete({ userId });
    if (!userProfile) {
      return res.status(404).json({ error: "Profile not found" });
    }

    res.status(204).json({ message: "Profile deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
