import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Package, Clock, CheckCircle, ChefHat } from "lucide-react";
import axios from "axios";

const Orders = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    fetchOrders();
  }, [isAuthenticated, navigate, user]);

  const fetchOrders = async () => {
    try {
      const response = await axios.get(`${API_URL}/orders/my-orders`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      // Filter to show only active orders (not Delivered)
      const activeOrders = (response.data.data || []).filter(
        (order) => order.status !== "Delivered"
      );
      setOrders(activeOrders);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "Preparing":
        return "bg-blue-100 text-blue-800 border-blue-300";
      case "Ready":
        return "bg-green-100 text-green-800 border-green-300";
      case "Delivered":
        return "bg-gray-100 text-gray-800 border-gray-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Pending":
        return <Clock className="h-5 w-5" />;
      case "Preparing":
        return <ChefHat className="h-5 w-5" />;
      case "Ready":
        return <Package className="h-5 w-5" />;
      case "Delivered":
        return <CheckCircle className="h-5 w-5" />;
      default:
        return <Clock className="h-5 w-5" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-text-light">Loading your orders...</p>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">📦</div>
          <h2 className="text-2xl font-bold text-primary mb-2">
            No orders yet
          </h2>
          <p className="text-text-light mb-6">
            Start by ordering something delicious!
          </p>
          <button
            onClick={() => navigate("/menu")}
            className="bg-secondary hover:bg-secondary-dark text-gray-900 font-bold px-8 py-3 rounded-lg transition-colors duration-200"
          >
            Browse Menu
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-3xl font-bold text-primary mb-8">My Orders</h1>

        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order._id} className="bg-white rounded-xl shadow-lg p-6">
              {/* Order Header */}
              <div className="flex flex-wrap items-center justify-between mb-4 gap-4">
                <div>
                  <h3 className="text-lg font-bold text-primary">
                    Order #{order.tokenNumber}
                  </h3>
                  <p className="text-sm text-text-light">
                    {new Date(order.createdAt).toLocaleString()}
                  </p>
                </div>
                <div
                  className={`px-4 py-2 rounded-lg border-2 font-medium flex items-center gap-2 ${getStatusColor(
                    order.status
                  )}`}
                >
                  {getStatusIcon(order.status)}
                  {order.status}
                </div>
              </div>

              {/* Order Items */}
              <div className="border-t border-gray-200 pt-4 mb-4">
                <h4 className="font-bold text-text mb-3">Items:</h4>
                <div className="space-y-2">
                  {order.items.map((item, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center text-sm"
                    >
                      <span className="text-text">
                        {item.qty}x {item.name}
                      </span>
                      <span className="font-medium">
                        ₹{item.price * item.qty}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Total with Breakdown */}
              <div className="border-t border-gray-200 pt-4">
                {/* Subtotal */}
                <div className="flex justify-between items-center mb-2">
                  <span className="text-text">Subtotal</span>
                  <span className="font-medium">
                    ₹
                    {order.items.reduce(
                      (sum, item) => sum + item.price * item.qty,
                      0
                    )}
                  </span>
                </div>

                {/* Delivery Option & Charges */}
                <div className="flex justify-between items-center mb-2">
                  <span className="text-text">
                    {order.deliveryOption === "delivery" && "Delivery Charges"}
                    {order.deliveryOption === "takeaway" &&
                      "Takeaway (Packing Charges)"}
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
                <div className="border-t border-gray-200 pt-3 mt-3 flex justify-between items-center">
                  <span className="font-bold text-primary text-lg">
                    Total Amount
                  </span>
                  <span className="text-2xl font-bold text-secondary">
                    ₹{order.totalAmount}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Orders;
