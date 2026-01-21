import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AccessDenied from "../components/AccessDenied";
import AdminOrders from "../components/admin/AdminOrders";
import AdminMenu from "../components/admin/AdminMenu";
import axios from "axios";

const Admin = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState("orders"); // 'orders' or 'menu'
  const [activeOrders, setActiveOrders] = useState([]);
  const [readyOrders, setReadyOrders] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    fetchOrders();
    fetchMenuItems();

    // Auto-cleanup polling - run every 5 minutes
    const cleanupInterval = setInterval(async () => {
      try {
        await axios.post(
          `${API_URL}/orders/cleanup-ready`,
          {},
          { headers: { Authorization: `Bearer ${user.token}` } }
        );
        fetchOrders(); // Refresh orders after cleanup
      } catch (error) {
        console.error("Auto-cleanup error:", error);
      }
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(cleanupInterval);
  }, [isAuthenticated, navigate, user]);

  const fetchOrders = async () => {
    try {
      const response = await axios.get(`${API_URL}/orders/all`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });

      const orders = response.data.data || [];

      // Split orders into active (Pending/Preparing) and ready
      const active = orders.filter(
        (order) => order.status === "Pending" || order.status === "Preparing"
      );
      const ready = orders.filter((order) => order.status === "Ready");

      setActiveOrders(active);
      setReadyOrders(ready);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
      setLoading(false);
    }
  };

  const fetchMenuItems = async () => {
    try {
      const response = await axios.get(`${API_URL}/menu/all`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setMenuItems(response.data.data || []);
    } catch (error) {
      console.error("Failed to fetch menu:", error);
    }
  };

  const updateOrderStatus = async (id, status) => {
    try {
      await axios.patch(
        `${API_URL}/orders/${id}/status`,
        { status },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );

      // Update local state
      if (status === "Ready") {
        const order = activeOrders.find((o) => o._id === id);
        if (order) {
          setActiveOrders(activeOrders.filter((o) => o._id !== id));
          setReadyOrders([...readyOrders, { ...order, status: "Ready" }]);
        }
      } else if (status === "Delivered") {
        setReadyOrders(readyOrders.filter((o) => o._id !== id));
      }

      alert(`Order status updated to ${status}`);
    } catch (error) {
      console.error("Failed to update status:", error);
      alert("Failed to update order status");
    }
  };

  const handleAddMenuItem = async (formData) => {
    try {
      const response = await axios.post(`${API_URL}/menu`, formData, {
        headers: { Authorization: `Bearer ${user.token}` },
      });

      const newMenuItem =
        response.data.menuItem || response.data.data || response.data;

      if (newMenuItem && newMenuItem._id) {
        setMenuItems([...menuItems, newMenuItem]);
        alert("Menu item added successfully!");
      } else {
        throw new Error("Invalid response structure");
      }
    } catch (error) {
      console.error("Failed to add menu item:", error);
      alert(
        `Failed to add menu item: ${
          error.response?.data?.message || error.message
        }`
      );
    }
  };

  const handleEditMenuItem = async (id, formData) => {
    try {
      const response = await axios.put(`${API_URL}/menu/${id}`, formData, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      const updatedItem = response.data.data || response.data;
      setMenuItems(
        menuItems.map((item) => (item._id === id ? updatedItem : item))
      );
      alert("Menu item updated successfully!");
    } catch (error) {
      console.error("Failed to update menu item:", error);
      alert("Failed to update menu item");
    }
  };

  const toggleAvailability = async (itemId) => {
    try {
      const currentItem = menuItems.find((item) => item._id === itemId);
      const response = await axios.patch(
        `${API_URL}/menu/${itemId}/availability`,
        { isAvailable: !currentItem.isAvailable },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      const updatedItem = response.data.data || response.data;
      setMenuItems(
        menuItems.map((item) => (item._id === itemId ? updatedItem : item))
      );
      alert("Availability updated!");
    } catch (error) {
      console.error("Failed to toggle availability:", error);
      alert("Failed to update availability");
    }
  };

  const deleteMenuItem = async (itemId) => {
    if (!confirm("Are you sure you want to delete this item?")) return;

    try {
      await axios.delete(`${API_URL}/menu/${itemId}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setMenuItems(menuItems.filter((item) => item._id !== itemId));
      alert("Menu item deleted successfully!");
    } catch (error) {
      console.error("Failed to delete menu item:", error);
      alert("Failed to delete menu item");
    }
  };

  // Access control
  if (!loading && user && user.role !== "admin") {
    return <AccessDenied />;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-text-light">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Dashboard Header */}
        <div className="bg-gradient-to-r from-primary to-primary-dark rounded-xl shadow-lg p-6 mb-8">
          <h1 className="text-3xl font-bold text-grey mb-2">Admin Dashboard</h1>
          <p className="text-navy blue-100">Manage orders and menu items</p>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-xl shadow-md mb-6">
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab("orders")}
              className={`flex-1 py-4 px-6 font-bold transition-colors ${
                activeTab === "orders"
                  ? "bg-secondary text-gray-900 border-b-4 border-secondary"
                  : "text-text-light hover:bg-gray-50"
              }`}
            >
              Orders Management
            </button>
            <button
              onClick={() => setActiveTab("menu")}
              className={`flex-1 py-4 px-6 font-bold transition-colors ${
                activeTab === "menu"
                  ? "bg-secondary text-gray-900 border-b-4 border-secondary"
                  : "text-text-light hover:bg-gray-50"
              }`}
            >
              Menu Management
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-xl shadow-md p-6">
          {activeTab === "orders" ? (
            <AdminOrders
              activeOrders={activeOrders}
              readyOrders={readyOrders}
              onUpdateStatus={updateOrderStatus}
              loading={false}
            />
          ) : (
            <AdminMenu
              menuItems={menuItems}
              onAdd={handleAddMenuItem}
              onEdit={handleEditMenuItem}
              onDelete={deleteMenuItem}
              onToggleAvailability={toggleAvailability}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Admin;
