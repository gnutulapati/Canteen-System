import { ShoppingCart, User, UtensilsCrossed } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import logo from "../assets/logo.png";

const Navbar = () => {
  const { user, logout, isAuthenticated, isAdmin } = useAuth();
  const { itemCount } = useCart();

  return (
    <nav
      className="shadow-lg sticky top-0 z-50"
      style={{ backgroundColor: "#132450" }}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo Section */}
          <Link to="/" className="flex items-center space-x-3">
            <img
              src={logo}
              alt="SRCM Logo"
              className="h-10 w-10 object-contain"
              onError={(e) => {
                // Fallback if logo doesn't exist
                e.target.style.display = "none";
              }}
            />
            <div className="flex items-center space-x-2">
              <UtensilsCrossed className="h-6 w-6 text-white" />
              <span className="text-white text-xl font-bold">SRCM Canteen</span>
            </div>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/menu"
              className="text-white hover:text-secondary transition-colors duration-200 font-medium"
            >
              Menu
            </Link>
            <Link
              to="/orders"
              className="text-white hover:text-secondary transition-colors duration-200 font-medium"
            >
              Orders
            </Link>
            {isAdmin && (
              <Link
                to="/admin"
                className="text-white hover:text-secondary transition-colors duration-200 font-medium"
              >
                Admin
              </Link>
            )}
            <Link
              to="/cart"
              className="text-white hover:text-secondary transition-colors duration-200 font-medium relative"
            >
              <div className="flex items-center space-x-2">
                <ShoppingCart className="h-5 w-5" />
                <span>Cart</span>
                {itemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-accent text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </div>
            </Link>
          </div>

          {/* User Section */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                <Link
                  to="/profile"
                  className="hidden md:flex items-center space-x-2 text-white hover:text-secondary transition-colors duration-200"
                >
                  <User className="h-5 w-5" />
                  <span className="text-sm font-medium">{user?.name}</span>
                </Link>
                <button
                  onClick={logout}
                  className="bg-blue-50 border-2 border-blue-200 hover:bg-blue-100 hover:border-blue-300 text-blue-900 font-medium px-4 py-2 rounded-lg transition-colors duration-200"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="bg-blue-50 border-2 border-blue-200 hover:bg-blue-100 hover:border-blue-300 text-blue-900 font-medium px-4 py-2 rounded-lg transition-colors duration-200"
              >
                Login
              </Link>
            )}
          </div>
        </div>

        {/* Mobile Menu Links */}
        <div className="md:hidden pb-4 flex items-center justify-around">
          <Link
            to="/menu"
            className="text-white hover:text-secondary transition-colors duration-200 text-sm"
          >
            Menu
          </Link>
          <Link
            to="/orders"
            className="text-white hover:text-secondary transition-colors duration-200 text-sm"
          >
            Orders
          </Link>
          <Link
            to="/cart"
            className="text-white hover:text-secondary transition-colors duration-200 text-sm relative"
          >
            Cart
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-accent text-white text-xs font-bold rounded-full h-4 w-4 flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </Link>
          {isAuthenticated && (
            <Link
              to="/profile"
              className="text-white hover:text-secondary transition-colors duration-200 text-sm"
            >
              Profile
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
