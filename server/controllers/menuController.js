const MenuItem = require("../models/MenuItem");

/**
 * Get All Available Menu Items
 * Public access - no authentication required
 * Returns only items where isAvailable: true
 *
 * GET /api/menu
 */
exports.getMenu = async (req, res) => {
  try {
    const { category } = req.query;

    // Build query
    const query = { isAvailable: true };
    if (category) {
      query.category = category;
    }

    const menuItems = await MenuItem.find(query).sort({ category: 1, name: 1 });

    return res.status(200).json({
      success: true,
      count: menuItems.length,
      data: menuItems,
    });
  } catch (error) {
    console.error("Get Menu Error:", error);
    return res.status(500).json({
      error: "Failed to fetch menu items",
      message: error.message,
    });
  }
};

/**
 * Get All Menu Items (Including Unavailable)
 * Admin only - includes unavailable items
 *
 * GET /api/menu/all
 * Requires: authMiddleware, adminMiddleware
 */
exports.getAllMenuItems = async (req, res) => {
  try {
    const menuItems = await MenuItem.find({}).sort({ category: 1, name: 1 });

    return res.status(200).json({
      success: true,
      count: menuItems.length,
      data: menuItems,
    });
  } catch (error) {
    console.error("Get All Menu Items Error:", error);
    return res.status(500).json({
      error: "Failed to fetch all menu items",
      message: error.message,
    });
  }
};

/**
 * Add New Menu Item
 * Admin only
 *
 * POST /api/menu
 * Requires: authMiddleware, adminMiddleware
 */
exports.addMenuItem = async (req, res) => {
  try {
    const { name, category, price, imageUrl, isAvailable } = req.body;

    // Validation
    if (!name || !category || price === undefined) {
      return res.status(400).json({
        error: "Missing required fields",
        message: "Name, category, and price are required",
      });
    }

    if (price < 0) {
      return res.status(400).json({
        error: "Invalid price",
        message: "Price cannot be negative",
      });
    }

    // Create new menu item
    const menuItem = new MenuItem({
      name,
      category,
      price,
      imageUrl: imageUrl || "",
      isAvailable: isAvailable !== undefined ? isAvailable : true,
    });

    await menuItem.save();

    return res.status(201).json({
      success: true,
      message: "Menu item created successfully",
      data: menuItem,
    });
  } catch (error) {
    console.error("Add Menu Item Error:", error);
    return res.status(500).json({
      error: "Failed to create menu item",
      message: error.message,
    });
  }
};

/**
 * Update Menu Item
 * Admin only
 *
 * PUT /api/menu/:id
 * Requires: authMiddleware, adminMiddleware
 */
exports.updateMenuItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, category, price, imageUrl, isAvailable } = req.body;

    const menuItem = await MenuItem.findById(id);

    if (!menuItem) {
      return res.status(404).json({
        error: "Menu item not found",
      });
    }

    // Update fields
    if (name !== undefined) menuItem.name = name;
    if (category !== undefined) menuItem.category = category;
    if (price !== undefined) {
      if (price < 0) {
        return res.status(400).json({
          error: "Invalid price",
          message: "Price cannot be negative",
        });
      }
      menuItem.price = price;
    }
    if (imageUrl !== undefined) menuItem.imageUrl = imageUrl;
    if (isAvailable !== undefined) menuItem.isAvailable = isAvailable;

    await menuItem.save();

    return res.status(200).json({
      success: true,
      message: "Menu item updated successfully",
      data: menuItem,
    });
  } catch (error) {
    console.error("Update Menu Item Error:", error);
    return res.status(500).json({
      error: "Failed to update menu item",
      message: error.message,
    });
  }
};

/**
 * Toggle Menu Item Availability (Stock)
 * Admin only
 *
 * PATCH /api/menu/:id/availability
 * Requires: authMiddleware, adminMiddleware
 */
exports.updateStock = async (req, res) => {
  try {
    const { id } = req.params;
    const { isAvailable } = req.body;

    if (isAvailable === undefined) {
      return res.status(400).json({
        error: "Missing required field",
        message: "isAvailable field is required",
      });
    }

    const menuItem = await MenuItem.findByIdAndUpdate(
      id,
      { isAvailable },
      { new: true, runValidators: true }
    );

    if (!menuItem) {
      return res.status(404).json({
        error: "Menu item not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: `Menu item ${
        isAvailable ? "marked as available" : "marked as unavailable"
      }`,
      data: menuItem,
    });
  } catch (error) {
    console.error("Update Stock Error:", error);
    return res.status(500).json({
      error: "Failed to update availability",
      message: error.message,
    });
  }
};

/**
 * Delete Menu Item
 * Admin only
 *
 * DELETE /api/menu/:id
 * Requires: authMiddleware, adminMiddleware
 */
exports.deleteMenuItem = async (req, res) => {
  try {
    const { id } = req.params;

    const menuItem = await MenuItem.findByIdAndDelete(id);

    if (!menuItem) {
      return res.status(404).json({
        error: "Menu item not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Menu item deleted successfully",
    });
  } catch (error) {
    console.error("Delete Menu Item Error:", error);
    return res.status(500).json({
      error: "Failed to delete menu item",
      message: error.message,
    });
  }
};
