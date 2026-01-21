const admin = require("firebase-admin");
const User = require("../models/User");

/**
 * Authentication Middleware
 * Verifies Firebase token from request headers
 * Finds user in MongoDB by firebaseUid
 * Attaches user object to req.user
 */
const authMiddleware = async (req, res, next) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        error: "Unauthorized",
        message:
          "No token provided. Please include Bearer token in Authorization header.",
      });
    }

    // Extract token
    const token = authHeader.split("Bearer ")[1];

    // Verify Firebase token
    const decodedToken = await admin.auth().verifyIdToken(token);
    const firebaseUid = decodedToken.uid;

    // Find user in MongoDB
    const user = await User.findOne({ firebaseUid });

    if (!user) {
      return res.status(404).json({
        error: "User not found",
        message:
          "User does not exist in database. Please sync your account first.",
      });
    }

    // Attach user to request object
    req.user = user;
    req.firebaseUid = firebaseUid;

    next();
  } catch (error) {
    console.error("Auth Middleware Error:", error);

    if (error.code === "auth/id-token-expired") {
      return res.status(401).json({
        error: "Token expired",
        message: "Your session has expired. Please log in again.",
      });
    }

    if (error.code === "auth/argument-error") {
      return res.status(401).json({
        error: "Invalid token",
        message: "The token provided is invalid.",
      });
    }

    return res.status(401).json({
      error: "Authentication failed",
      message: error.message,
    });
  }
};

module.exports = authMiddleware;
