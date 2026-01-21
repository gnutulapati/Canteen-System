const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

/**
 * Order Routes
 * Base path: /api/orders
 */

// POST /api/orders/create-razorpay-order - Create Razorpay order for payment
router.post(
  "/create-razorpay-order",
  authMiddleware,
  orderController.createRazorpayOrder
);

// POST /api/orders - Create order after payment verification
router.post("/", authMiddleware, orderController.createOrder);

// GET /api/orders/my-orders - Get current user's orders
router.get("/my-orders", authMiddleware, orderController.getUserOrders);

// GET /api/orders/all - Get all orders (admin only)
router.get(
  "/all",
  authMiddleware,
  adminMiddleware,
  orderController.getAllOrders
);

// GET /api/orders/:id - Get single order details
router.get("/:id", authMiddleware, orderController.getOrder);

// PATCH /api/orders/:id/status - Update order status (admin only)
router.patch(
  "/:id/status",
  authMiddleware,
  adminMiddleware,
  orderController.updateStatus
);

// POST /api/orders/cleanup-ready - Cleanup old ready orders (admin only)
router.post(
  "/cleanup-ready",
  authMiddleware,
  adminMiddleware,
  orderController.cleanupReadyOrders
);

module.exports = router;
