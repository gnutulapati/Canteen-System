const admin = require("firebase-admin");
const User = require("../models/User");

/**
 * Sync User with Database
 * Called when user logs in on frontend
 * Creates new user if doesn't exist, returns existing user otherwise
 *
 * POST /api/auth/sync
 */
exports.syncUser = async (req, res) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        error: "No token provided",
      });
    }

    const token = authHeader.split("Bearer ")[1];

    // Verify Firebase token
    const decodedToken = await admin.auth().verifyIdToken(token);
    const { uid, email, name } = decodedToken;

    // Check if user exists
    let user = await User.findOne({ firebaseUid: uid });

    if (user) {
      // User exists, return existing user
      return res.status(200).json({
        message: "User already exists",
        user: {
          id: user._id,
          firebaseUid: user.firebaseUid,
          email: user.email,
          name: user.name,
          role: user.role,
          createdAt: user.createdAt,
        },
      });
    }

    // Create new user with role 'student' (default)
    user = new User({
      firebaseUid: uid,
      email: email || decodedToken.email,
      name: name || decodedToken.name || email?.split("@")[0] || "User",
      role: "student",
    });

    await user.save();

    return res.status(201).json({
      message: "User created successfully",
      user: {
        id: user._id,
        firebaseUid: user.firebaseUid,
        email: user.email,
        name: user.name,
        role: user.role,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error("Sync User Error:", error);

    if (error.code === "auth/id-token-expired") {
      return res.status(401).json({
        error: "Token expired",
        message: "Your session has expired. Please log in again.",
      });
    }

    return res.status(500).json({
      error: "Failed to sync user",
      message: error.message,
    });
  }
};

/**
 * Get Current User Profile
 * Returns the authenticated user's profile
 *
 * GET /api/auth/profile
 * Requires: authMiddleware
 */
exports.getProfile = async (req, res) => {
  try {
    res.status(200).json({
      user: {
        id: req.user._id,
        firebaseUid: req.user.firebaseUid,
        email: req.user.email,
        name: req.user.name,
        role: req.user.role,
        createdAt: req.user.createdAt,
      },
    });
  } catch (error) {
    console.error("Get Profile Error:", error);
    res.status(500).json({
      error: "Failed to fetch profile",
      message: error.message,
    });
  }
};
