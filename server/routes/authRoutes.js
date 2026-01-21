const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");

/**
 * Auth Routes
 * Base path: /api/auth
 */

// POST /api/auth/sync - Sync user with database on login
router.post("/sync", authController.syncUser);

// GET /api/auth/profile - Get current user profile (protected)
router.get("/profile", authMiddleware, authController.getProfile);

module.exports = router;
