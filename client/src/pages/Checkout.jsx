import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import {
  Trash2,
  Plus,
  Minus,
  Package,
  Truck,
  CreditCard,
  UtensilsCrossed,
} from "lucide-react";

const Checkout = () => {
  const navigate = useNavigate();
  const {
    cartItems,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    clearCart,
    totalPrice,
  } = useCart();
  const { user, isAuthenticated } = useAuth();

  // Delivery option state (radio button - required)
  const [deliveryOption, setDeliveryOption] = useState(""); // 'delivery', 'takeaway', or 'dinein'
  const [isProcessing, setIsProcessing] = useState(false);

  // Delivery option fees
  const DELIVERY_FEE = 20;
  const TAKEAWAY_FEE = 10;
  const DINEIN_FEE = 0;

  // Calculate additional charges based on selected option
  const getAdditionalCharges = () => {
    switch (deliveryOption) {
      case "delivery":
        return DELIVERY_FEE;
      case "takeaway":
        return TAKEAWAY_FEE;
      case "dinein":
        return DINEIN_FEE;
      default:
        return 0;
    }
  };

  const additionalCharges = getAdditionalCharges();
  const finalTotal = totalPrice + additionalCharges;

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  const handlePayNow = async () => {
    if (cartItems.length === 0) return;

    // Validate delivery option is selected
    if (!deliveryOption) {
      alert("Please select a delivery option (Delivery, Takeaway, or Dine-in)");
      return;
    }

    setIsProcessing(true);

    try {
      const API_URL =
        import.meta.env.VITE_API_URL || "http://localhost:5000/api";
      const RAZORPAY_KEY_ID = import.meta.env.VITE_RAZORPAY_KEY_ID;

      // Step 1: Create Razorpay order
      const razorpayOrderResponse = await fetch(
        `${API_URL}/orders/create-razorpay-order`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify({ amount: finalTotal }),
        }
      );

      const razorpayOrderData = await razorpayOrderResponse.json();

      if (!razorpayOrderResponse.ok || !razorpayOrderData.success) {
        throw new Error("Failed to create payment order");
      }

      const { orderId, amount, currency } = razorpayOrderData.data;

      // Step 2: Open Razorpay payment modal
      const options = {
        key: RAZORPAY_KEY_ID,
        amount: amount,
        currency: currency,
        name: "SRCM Canteen",
        description: "Food Order Payment",
        order_id: orderId,
        handler: async function (response) {
          // Step 3: Payment successful - create order in database
          try {
            const orderData = {
              items: cartItems.map((item) => ({
                menuItemId: item._id,
                name: item.name,
                price: item.price,
                qty: item.qty,
              })),
              totalAmount: finalTotal,
              paymentId: response.razorpay_payment_id,
              orderId: response.razorpay_order_id,
              signature: response.razorpay_signature,
              deliveryOption: deliveryOption,
            };

            const createOrderResponse = await fetch(`${API_URL}/orders`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${user.token}`,
              },
              body: JSON.stringify(orderData),
            });

            const result = await createOrderResponse.json();

            if (createOrderResponse.ok && result.success) {
              const optionNames = {
                delivery: "Delivery",
                takeaway: "Takeaway",
                dinein: "Dine-in",
              };

              alert(
                `Payment Successful! 🎉\n\nOrder placed successfully!\nToken Number: ${
                  result.data.tokenNumber
                }\nTotal: ₹${finalTotal}\nOption: ${
                  optionNames[deliveryOption]
                }${
                  additionalCharges > 0 ? ` (+₹${additionalCharges})` : ""
                }\n\nYour order is being prepared!`
              );

              clearCart();
              navigate("/orders");
            } else {
              throw new Error(result.message || "Failed to create order");
            }
          } catch (error) {
            console.error("Order creation error:", error);
            alert(
              `Payment successful but order creation failed: ${error.message}\n\nPlease contact support with payment ID: ${response.razorpay_payment_id}`
            );
          } finally {
            setIsProcessing(false);
          }
        },
        prefill: {
          name: user?.name || "",
          email: user?.email || "",
        },
        theme: {
          color: "#1e40af",
        },
        modal: {
          ondismiss: function () {
            setIsProcessing(false);
            alert("Payment cancelled. Your cart items are still saved.");
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.on("payment.failed", function (response) {
        setIsProcessing(false);
        alert(
          `Payment Failed!\n\nReason: ${response.error.description}\n\nPlease try again or use a different payment method.`
        );
      });

      razorpay.open();
    } catch (error) {
      console.error("Payment initialization error:", error);
      alert(
        `Failed to initialize payment: ${error.message}\n\nPlease try again or contact support.`
      );
      setIsProcessing(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🛒</div>
          <h2 className="text-2xl font-bold text-primary mb-2">
            Your cart is empty
          </h2>
          <p className="text-text-light mb-6">
            Add some delicious items to get started!
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
        <h1 className="text-3xl font-bold text-primary mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-primary mb-4 flex items-center gap-2">
                <Package className="h-5 w-5" />
                Your Items ({cartItems.length})
              </h2>

              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div
                    key={item._id}
                    className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg"
                  >
                    <img
                      src={
                        item.imageUrl ||
                        "https://placehold.co/100x100?text=Item"
                      }
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded-lg"
                    />

                    <div className="flex-1">
                      <h3 className="font-bold text-primary">{item.name}</h3>
                      <p className="text-text-light text-sm">{item.category}</p>
                      <p className="text-lg font-bold text-secondary mt-1">
                        ₹{item.price}
                      </p>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => decreaseQuantity(item._id)}
                        className="bg-gray-200 hover:bg-gray-300 p-2 rounded-lg transition-colors"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="font-bold text-lg w-8 text-center">
                        {item.qty}
                      </span>
                      <button
                        onClick={() => increaseQuantity(item._id)}
                        className="bg-gray-200 hover:bg-gray-300 p-2 rounded-lg transition-colors"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>

                    {/* Subtotal */}
                    <div className="text-right">
                      <p className="text-sm text-text-light">Subtotal</p>
                      <p className="font-bold text-lg">
                        ₹{item.price * item.qty}
                      </p>
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={() => removeFromCart(item._id)}
                      className="text-accent hover:text-accent-dark transition-colors"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-20">
              <h2 className="text-xl font-bold text-primary mb-4">
                Order Summary
              </h2>

              {/* Cart Total */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-text">
                  <span>Cart Total</span>
                  <span className="font-bold">₹{totalPrice}</span>
                </div>

                {/* Delivery Options - Radio Buttons */}
                <div className="border-t pt-3 space-y-3">
                  <p className="text-sm font-bold text-primary mb-2">
                    Select Delivery Option{" "}
                    <span className="text-accent">*</span>
                  </p>

                  {/* Delivery Option */}
                  <label
                    className={`flex items-center justify-between cursor-pointer p-3 rounded-lg border-2 transition-all ${
                      deliveryOption === "delivery"
                        ? "border-secondary bg-secondary bg-opacity-10"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="deliveryOption"
                        value="delivery"
                        checked={deliveryOption === "delivery"}
                        onChange={(e) => setDeliveryOption(e.target.value)}
                        className="w-5 h-5 accent-secondary cursor-pointer"
                      />
                      <Truck className="h-5 w-5 text-primary" />
                      <span className="text-sm font-medium text-text">
                        Delivery
                      </span>
                    </div>
                    <span className="text-sm font-bold text-secondary">
                      ₹{DELIVERY_FEE}
                    </span>
                  </label>

                  {/* Takeaway Option */}
                  <label
                    className={`flex items-center justify-between cursor-pointer p-3 rounded-lg border-2 transition-all ${
                      deliveryOption === "takeaway"
                        ? "border-secondary bg-secondary bg-opacity-10"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="deliveryOption"
                        value="takeaway"
                        checked={deliveryOption === "takeaway"}
                        onChange={(e) => setDeliveryOption(e.target.value)}
                        className="w-5 h-5 accent-secondary cursor-pointer"
                      />
                      <Package className="h-5 w-5 text-primary" />
                      <span className="text-sm font-medium text-text">
                        Takeaway (Packing Charges)
                      </span>
                    </div>
                    <span className="text-sm font-bold text-secondary">
                      ₹{TAKEAWAY_FEE}
                    </span>
                  </label>

                  {/* Dine-in Option */}
                  <label
                    className={`flex items-center justify-between cursor-pointer p-3 rounded-lg border-2 transition-all ${
                      deliveryOption === "dinein"
                        ? "border-secondary bg-secondary bg-opacity-10"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="deliveryOption"
                        value="dinein"
                        checked={deliveryOption === "dinein"}
                        onChange={(e) => setDeliveryOption(e.target.value)}
                        className="w-5 h-5 accent-secondary cursor-pointer"
                      />
                      <UtensilsCrossed className="h-5 w-5 text-primary" />
                      <span className="text-sm font-medium text-text">
                        Dine-in (Eat at canteen)
                      </span>
                    </div>
                    <span className="text-sm font-bold text-green-600">
                      Free
                    </span>
                  </label>
                </div>

                {/* Additional Charges Summary */}
                {additionalCharges > 0 && (
                  <div className="flex justify-between text-text text-sm">
                    <span>Additional Charges</span>
                    <span className="font-medium">+ ₹{additionalCharges}</span>
                  </div>
                )}
              </div>

              {/* Final Total */}
              <div className="border-t-2 border-primary pt-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-primary">
                    Final Total
                  </span>
                  <span className="text-2xl font-bold text-secondary">
                    ₹{finalTotal}
                  </span>
                </div>
              </div>

              {/* Pay Now Button */}
              <button
                onClick={handlePayNow}
                disabled={isProcessing}
                className={`w-full py-4 rounded-lg font-bold text-gray-900 flex items-center justify-center gap-2 transition-all duration-200 ${
                  isProcessing
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-secondary hover:bg-secondary-dark shadow-lg hover:shadow-xl active:scale-95"
                }`}
              >
                <CreditCard className="h-5 w-5" />
                {isProcessing ? "Processing..." : `Pay ₹${finalTotal} Now`}
              </button>

              <p className="text-xs text-text-light text-center mt-4">
                Secure payment powered by Razorpay
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
