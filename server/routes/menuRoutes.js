const express = require("express");
const router = express.Router();
const menuController = require("../controllers/menuController");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

/**
 * Menu Routes
 * Base path: /api/menu
 */

// GET /api/menu - Get all available menu items (public)
router.get("/", menuController.getMenu);

// GET /api/menu/all - Get all menu items including unavailable (admin only)
router.get(
  "/all",
  authMiddleware,
  adminMiddleware,
  menuController.getAllMenuItems
);

// POST /api/menu - Add new menu item (admin only)
router.post("/", authMiddleware, adminMiddleware, menuController.addMenuItem);

// PUT /api/menu/:id - Update menu item (admin only)
router.put(
  "/:id",
  authMiddleware,
  adminMiddleware,
  menuController.updateMenuItem
);

// PATCH /api/menu/:id/availability - Toggle availability/stock (admin only)
router.patch(
  "/:id/availability",
  authMiddleware,
  adminMiddleware,
  menuController.updateStock
);

// DELETE /api/menu/:id - Delete menu item (admin only)
router.delete(
  "/:id",
  authMiddleware,
  adminMiddleware,
  menuController.deleteMenuItem
);

module.exports = router;
