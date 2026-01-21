import { createContext, useContext, useEffect, useState } from "react";

// Create Cart Context
const CartContext = createContext(null);

// Custom hook to use cart context
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

// Cart Provider Component
export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem("canteenCart");
      if (savedCart) {
        setCartItems(JSON.parse(savedCart));
      }
    } catch (error) {
      console.error("Error loading cart from localStorage:", error);
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem("canteenCart", JSON.stringify(cartItems));
    } catch (error) {
      console.error("Error saving cart to localStorage:", error);
    }
  }, [cartItems]);

  // Add item to cart
  const addToCart = (item) => {
    setCartItems((prevItems) => {
      // Check if item already exists in cart
      const existingItemIndex = prevItems.findIndex((i) => i._id === item._id);

      if (existingItemIndex > -1) {
        // Item exists, increment quantity
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          qty: updatedItems[existingItemIndex].qty + 1,
        };
        return updatedItems;
      } else {
        // New item, add with qty: 1
        return [...prevItems, { ...item, qty: 1 }];
      }
    });
  };

  // Remove item from cart completely
  const removeFromCart = (id) => {
    setCartItems((prevItems) => prevItems.filter((item) => item._id !== id));
  };

  // Decrease item quantity (or remove if qty becomes 0)
  const decreaseQuantity = (id) => {
    setCartItems((prevItems) => {
      const item = prevItems.find((i) => i._id === id);
      if (!item) return prevItems;

      if (item.qty <= 1) {
        // Remove item if quantity is 1
        return prevItems.filter((i) => i._id !== id);
      } else {
        // Decrease quantity
        return prevItems.map((i) =>
          i._id === id ? { ...i, qty: i.qty - 1 } : i
        );
      }
    });
  };

  // Increase item quantity
  const increaseQuantity = (id) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item._id === id ? { ...item, qty: item.qty + 1 } : item
      )
    );
  };

  // Update item quantity directly
  const updateQuantity = (id, qty) => {
    if (qty <= 0) {
      removeFromCart(id);
      return;
    }

    setCartItems((prevItems) =>
      prevItems.map((item) => (item._id === id ? { ...item, qty } : item))
    );
  };

  // Clear entire cart
  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem("canteenCart");
  };

  // Calculate total price
  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.qty,
    0
  );

  // Get total number of items
  const itemCount = cartItems.reduce((count, item) => count + item.qty, 0);

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    decreaseQuantity,
    increaseQuantity,
    updateQuantity,
    clearCart,
    totalPrice,
    itemCount,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export default CartContext;
