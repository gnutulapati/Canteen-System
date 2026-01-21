import { Plus, Edit2, Trash2 } from "lucide-react";
import { useState } from "react";
import MenuItemModal from "./MenuItemModal";

const AdminMenu = ({
  menuItems,
  onAdd,
  onEdit,
  onDelete,
  onToggleAvailability,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);

  const handleAddMenuItem = (formData) => {
    onAdd(formData);
    setShowAddModal(false);
  };

  const handleEditMenuItem = (formData) => {
    onEdit(currentItem._id, formData);
    setShowEditModal(false);
    setCurrentItem(null);
  };

  const openEditModal = (item) => {
    setCurrentItem(item);
    setShowEditModal(true);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-primary">Menu Items</h2>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-secondary hover:bg-secondary-dark text-gray-900 font-bold px-6 py-3 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus className="h-5 w-5" />
          Add Menu Item
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {menuItems.map((item) => (
          <div
            key={item._id}
            className="bg-white rounded-xl shadow-lg overflow-hidden"
          >
            <div className="relative h-48">
              <img
                src={
                  item.imageUrl || "https://placehold.co/400x300?text=No+Image"
                }
                alt={item.name}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => onToggleAvailability(item._id)}
                className={`absolute top-2 right-2 px-3 py-1 rounded-full font-bold text-sm ${
                  item.isAvailable
                    ? "bg-green-500 text-white"
                    : "bg-red-500 text-white"
                }`}
              >
                {item.isAvailable ? "Available" : "Unavailable"}
              </button>
            </div>

            <div className="p-4">
              <div className="mb-2">
                <span className="text-xs font-semibold text-secondary uppercase">
                  {item.category}
                </span>
              </div>
              <h3 className="text-xl font-bold text-primary mb-2">
                {item.name}
              </h3>
              <p className="text-2xl font-bold text-secondary mb-4">
                ₹{item.price}
              </p>

              <div className="flex gap-2">
                <button
                  onClick={() => openEditModal(item)}
                  className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 rounded-lg flex items-center justify-center gap-2 transition-colors"
                >
                  <Edit2 className="h-4 w-4" />
                  Edit
                </button>
                <button
                  onClick={() => onDelete(item._id)}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white font-medium py-2 rounded-lg flex items-center justify-center gap-2 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modals */}
      <MenuItemModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleAddMenuItem}
      />
      <MenuItemModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setCurrentItem(null);
        }}
        onSubmit={handleEditMenuItem}
        item={currentItem}
      />
    </div>
  );
};

export default AdminMenu;
