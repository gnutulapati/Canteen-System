import { Clock, CheckCircle2, ChefHat, Package } from "lucide-react";
import OrderCard from "./OrderCard";

const AdminOrders = ({
  activeOrders,
  readyOrders,
  onUpdateStatus,
  loading,
}) => {
  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-text-light">Loading orders...</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Active Orders */}
      <div>
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-t-xl p-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Clock className="h-6 w-6" />
            Active Orders ({activeOrders.length})
          </h2>
          <p className="text-blue-100 text-sm">Pending & Preparing</p>
        </div>
        <div className="bg-gray-50 rounded-b-xl p-4 min-h-[400px]">
          {activeOrders.length === 0 ? (
            <div className="text-center py-12 text-text-light">
              <ChefHat className="h-12 w-12 mx-auto mb-3 text-gray-400" />
              <p>No active orders</p>
            </div>
          ) : (
            activeOrders.map((order) => (
              <OrderCard
                key={order._id}
                order={order}
                onMarkReady={(id) => onUpdateStatus(id, "Ready")}
                showReadyButton={true}
              />
            ))
          )}
        </div>
      </div>

      {/* Ready Orders */}
      <div>
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-t-xl p-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <CheckCircle2 className="h-6 w-6" />
            Ready for Pickup ({readyOrders.length})
          </h2>
          <p className="text-green-100 text-sm">Ready to serve</p>
        </div>
        <div className="bg-gray-50 rounded-b-xl p-4 min-h-[400px]">
          {readyOrders.length === 0 ? (
            <div className="text-center py-12 text-text-light">
              <Package className="h-12 w-12 mx-auto mb-3 text-gray-400" />
              <p>No orders ready</p>
            </div>
          ) : (
            readyOrders.map((order) => (
              <OrderCard
                key={order._id}
                order={order}
                onMarkDelivered={(id) => onUpdateStatus(id, "Delivered")}
                showReadyButton={false}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminOrders;
