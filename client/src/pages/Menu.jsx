import { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import { ShoppingCart, Check, X } from "lucide-react";
import axios from "axios";

const Menu = () => {
  const { addToCart } = useCart();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const fetchMenuItems = async () => {
    try {
      const response = await axios.get(`${API_URL}/menu`);
      setMenuItems(response.data.data || []);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch menu:", error);
      setLoading(false);
    }
  };

  const categories = [
    "All",
    "Breakfast",
    "Lunch",
    "Snacks",
    "Dinner",
    "Drinks",
  ];

  const filteredMenu =
    selectedCategory === "All"
      ? menuItems
      : menuItems.filter((item) => item.category === selectedCategory);

  const handleAddToCart = (item) => {
    if (!item.isAvailable) return;
    addToCart({
      _id: item._id,
      name: item.name,
      price: item.price,
      imageUrl: item.imageUrl,
      category: item.category,
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-text-light">Loading menu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary mb-2">Our Menu</h1>
          <p className="text-text-light">
            Delicious meals prepared with love for the SRCM campus community
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 ${
                selectedCategory === category
                  ? "bg-secondary text-gray-900 shadow-lg scale-105"
                  : "bg-white text-text hover:bg-gray-100"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Menu Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredMenu.map((item) => (
            <div
              key={item._id}
              className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden bg-gray-100">
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
                {!item.isAvailable && (
                  <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
                    <div className="text-center">
                      <X className="h-12 w-12 text-white mx-auto mb-2" />
                      <span className="text-white font-bold text-lg">
                        Not Available
                      </span>
                    </div>
                  </div>
                )}
                {item.isAvailable && (
                  <div className="absolute top-2 right-2 bg-green-500 text-white px-3 py-1 rounded-full flex items-center gap-1 text-sm font-medium">
                    <Check className="h-4 w-4" />
                    Available
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-4">
                <div className="mb-2">
                  <span className="text-xs font-semibold text-secondary uppercase tracking-wide">
                    {item.category}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-primary mb-2">
                  {item.name}
                </h3>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl font-bold text-text">
                    {item.price === 0 ? "TBD" : `₹${item.price}`}
                  </span>
                </div>

                {/* Add to Cart Button */}
                <button
                  onClick={() => handleAddToCart(item)}
                  disabled={!item.isAvailable}
                  className={`w-full py-3 rounded-lg font-bold text-gray-900 flex items-center justify-center gap-2 transition-all duration-200 ${
                    item.isAvailable
                      ? "bg-secondary hover:bg-secondary-dark shadow-md hover:shadow-lg active:scale-95"
                      : "bg-gray-300 cursor-not-allowed opacity-50"
                  }`}
                >
                  <ShoppingCart className="h-5 w-5" />
                  {item.isAvailable ? "Add to Cart" : "Unavailable"}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredMenu.length === 0 && (
          <div className="text-center py-16">
            <p className="text-text-light text-lg">
              No items found in this category.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Menu;
