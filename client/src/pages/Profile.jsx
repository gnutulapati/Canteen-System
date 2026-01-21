import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import {
  User,
  Mail,
  Calendar,
  Shield,
  Package,
  Clock,
  CheckCircle,
  ChefHat,
} from "lucide-react";

const Profile = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, isAdmin } = useAuth();
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
      // Show all orders in profile (order history)
      setOrders(response.data.data || []);
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
        return <Clock className="h-4 w-4" />;
      case "Preparing":
        return <ChefHat className="h-4 w-4" />;
      case "Ready":
        return <Package className="h-4 w-4" />;
      case "Delivered":
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-text-light">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Profile Header */}
        <div className="bg-[#FFF5E1] rounded-xl shadow-lg p-8 mb-8 text-gray-600">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 bg-secondary rounded-full flex items-center justify-center">
              <User className="h-12 w-12 text-gray-900" />
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-2">
                {user?.name || "User"}
              </h1>
              <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  <span>{user?.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  <span className="capitalize">{user?.role || "Student"}</span>
                </div>
                {user?.createdAt && (
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>
                      Member since{" "}
                      {new Date(user.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>
            </div>
            {isAdmin && (
              <div className="bg-accent px-4 py-2 rounded-lg font-bold">
                ADMIN
              </div>
            )}
          </div>
        </div>

        {/* Order History */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-primary flex items-center gap-2">
              <Package className="h-6 w-6" />
              Order History
            </h2>
            <span className="text-text-light">
              {orders.length} {orders.length === 1 ? "order" : "orders"}
            </span>
          </div>

          {orders.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📦</div>
              <h3 className="text-xl font-bold text-primary mb-2">
                No orders yet
              </h3>
              <p className="text-text-light mb-6">
                Start by ordering something delicious!
              </p>
              <button
                onClick={() => navigate("/menu")}
                className="bg-secondary hover:bg-secondary-dark text-gray-900 font-bold px-6 py-3 rounded-lg transition-colors duration-200"
              >
                Browse Menu
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div
                  key={order._id}
                  className="bg-[#F0F9FF] border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-wrap items-center justify-between mb-3 gap-2">
                    <div>
                      <h3 className="font-bold text-primary">
                        Order #{order.tokenNumber}
                      </h3>
                      <p className="text-sm text-text-light">
                        {new Date(order.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <div
                      className={`px-3 py-1 rounded-lg border font-medium flex items-center gap-2 text-sm ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {getStatusIcon(order.status)}
                      {order.status}
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-3 mb-3">
                    <div className="space-y-1">
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

                  <div className="flex justify-between items-center border-t border-gray-200 pt-3">
                    <span className="font-bold text-text">Total</span>
                    <span className="text-xl font-bold text-secondary">
                      ₹{order.totalAmount}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
