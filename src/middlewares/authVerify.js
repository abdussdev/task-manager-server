const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const secretKey = "SecretKeyForJWT123";

const authVerify = (req, res, next) => {
  const token = req.header("token");

  if (!token) {
    return res.status(401).json({ message: "Authintication token is missing" });
  }

  //Verify the token
  jwt.verify(token, secretKey, async (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Invalid token" });
    }

    try {
      const user = await User.findById(decoded.userId);

      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }

      req.user = {
        userId: decoded.userId,
        email: decoded.email,
        name: decoded.name,
      };
      next();
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
};

module.exports = authVerify;
