const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    items: [
      {
        menuItemId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "MenuItem",
          required: true,
        },
        name: {
          type: String,
          required: true,
        },
        price: {
          type: Number,
          required: true,
          min: 0,
        },
        qty: {
          type: Number,
          required: true,
          min: 1,
          default: 1,
        },
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ["Pending", "Preparing", "Ready", "Delivered"],
      default: "Pending",
    },
    readyAt: {
      type: Date,
      default: null,
    },
    deliveryOption: {
      type: String,
      enum: ["delivery", "takeaway", "dinein"],
      default: "dinein",
    },
    deliveryAddress: {
      type: String,
      required: false, // Only for delivery orders
    },
    paymentId: {
      type: String,
      required: true,
    },
    tokenNumber: {
      type: String,
      unique: true,
      sparse: true,
    },
  },
  {
    timestamps: true,
  }
);

// Generate unique token number before saving
orderSchema.pre("save", async function () {
  if (!this.tokenNumber) {
    // Generate a unique 6-digit token from timestamp
    const timestamp = Date.now().toString();
    this.tokenNumber = timestamp.slice(-6);
  }
});

// Indexes for faster queries
orderSchema.index({ userId: 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ createdAt: -1 });
orderSchema.index({ tokenNumber: 1 });

module.exports = mongoose.model("Order", orderSchema);
