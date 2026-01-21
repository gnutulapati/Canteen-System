import {
  Package,
  Clock,
  CheckCircle2,
  ChefHat,
  ArrowRight,
} from "lucide-react";

const OrderCard = ({
  order,
  onMarkReady,
  onMarkDelivered,
  showReadyButton,
}) => (
  <div className="bg-white rounded-lg shadow-md p-4 mb-4 hover:shadow-lg transition-shadow">
    <div className="flex items-center justify-between mb-3">
      <div className="flex items-center gap-3">
        <div className="bg-secondary rounded-lg p-2">
          <Package className="h-5 w-5 text-gray-900" />
        </div>
        <div>
          <h3 className="font-bold text-primary text-lg">
            #{order.tokenNumber}
          </h3>
          <p className="text-sm text-text-light">
            {order.userId?.name || "Customer"}
          </p>
        </div>
      </div>
      <div
        className={`px-3 py-1 rounded-lg text-sm font-medium ${
          order.status === "Pending"
            ? "bg-yellow-100 text-yellow-800"
            : order.status === "Preparing"
            ? "bg-blue-100 text-blue-800"
            : "bg-green-100 text-green-800"
        }`}
      >
        {order.status === "Pending" && (
          <Clock className="h-4 w-4 inline mr-1" />
        )}
        {order.status === "Preparing" && (
          <ChefHat className="h-4 w-4 inline mr-1" />
        )}
        {order.status === "Ready" && (
          <CheckCircle2 className="h-4 w-4 inline mr-1" />
        )}
        {order.status}
      </div>
    </div>

    <div className="border-t border-gray-200 pt-3 mb-3">
      <div className="space-y-1">
        {order.items.map((item, idx) => (
          <div key={idx} className="flex justify-between text-sm">
            <span className="text-text">
              {item.qty}x {item.name}
            </span>
            <span className="font-medium">₹{item.price * item.qty}</span>
          </div>
        ))}
      </div>
    </div>

    {/* Order Total with Breakdown */}
    <div className="border-t border-gray-200 pt-3">
      {/* Subtotal */}
      <div className="flex justify-between items-center mb-2 text-sm">
        <span className="text-text">Subtotal</span>
        <span className="font-medium">
          ₹{order.items.reduce((sum, item) => sum + item.price * item.qty, 0)}
        </span>
      </div>

      {/* Delivery Option & Charges */}
      <div className="flex justify-between items-center mb-2 text-sm">
        <span className="text-text">
          {order.deliveryOption === "delivery" && "Delivery Charges"}
          {order.deliveryOption === "takeaway" && "Takeaway (Packing)"}
          {order.deliveryOption === "dinein" && "Dine-in"}
          {!order.deliveryOption && "Service Charges"}
        </span>
        <span className="font-medium text-green-600">
          {order.deliveryOption === "dinein" || !order.deliveryOption
            ? "Free"
            : `₹${
                order.totalAmount -
                order.items.reduce(
                  (sum, item) => sum + item.price * item.qty,
                  0
                )
              }`}
        </span>
      </div>

      {/* Final Total */}
      <div className="border-t border-gray-200 pt-2 mt-2 flex justify-between items-center">
        <span className="font-bold text-lg text-secondary">Total</span>
        <span className="font-bold text-lg text-secondary">
          ₹{order.totalAmount}
        </span>
      </div>
    </div>

    <div className="flex items-center justify-between border-t border-gray-200 pt-3 mt-3">
      <div className="flex gap-2">
        {showReadyButton && (
          <button
            onClick={() => onMarkReady(order._id)}
            className="bg-green-500 hover:bg-green-600 text-white font-medium px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            Mark Ready
            <ArrowRight className="h-4 w-4" />
          </button>
        )}
        {!showReadyButton && (
          <button
            onClick={() => onMarkDelivered(order._id)}
            className="bg-gray-700 hover:bg-gray-800 text-white font-medium px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            Mark Delivered
            <CheckCircle2 className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>

    <div className="mt-2 text-xs text-text-light">
      {new Date(order.createdAt).toLocaleString()}
    </div>
  </div>
);

export default OrderCard;
