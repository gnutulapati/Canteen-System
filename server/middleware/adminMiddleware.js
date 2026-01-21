/**
 * Admin Authorization Middleware
 * Checks if the authenticated user has admin role
 * Must be used AFTER authMiddleware
 */
const adminMiddleware = (req, res, next) => {
  try {
    // Check if user exists (should be set by authMiddleware)
    if (!req.user) {
      return res.status(401).json({
        error: "Unauthorized",
        message: "Authentication required. Please log in.",
      });
    }

    // Check if user has admin role
    if (req.user.role !== "admin") {
      return res.status(403).json({
        error: "Forbidden",
        message: "Access denied. Admin privileges required.",
      });
    }

    // User is admin, proceed
    next();
  } catch (error) {
    console.error("Admin Middleware Error:", error);
    return res.status(500).json({
      error: "Authorization check failed",
      message: error.message,
    });
  }
};

module.exports = adminMiddleware;
