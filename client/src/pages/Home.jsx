import { useNavigate } from "react-router-dom";
import { UtensilsCrossed, ShoppingCart, Clock, Award } from "lucide-react";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary to-primary-dark text-white">
        <div className="container mx-auto px-4 py-20 text-center">
          <div className="flex justify-center mb-6">
            <UtensilsCrossed className="h-20 w-20 text-secondary" />
          </div>
          <div className="flex flex-col items-center font-sans">
            {/* Header and Location Line */}
            <div className="flex flex-row items-center gap-4 mb-4">
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900">
                Welcome to SRCM Canteen
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 italic">
                — Tumukunta
              </p>
            </div>

            {/* Subtitle */}
            <p className="text-xl md:text-2xl mb-8 text-gray-700">
              Delicious meals for the SRCM campus community
            </p>
          </div>
          <button
            onClick={() => navigate("/menu")}
            className="bg-secondary hover:bg-secondary-dark text-gray-900 font-bold px-8 py-4 rounded-lg text-lg shadow-lg hover:shadow-xl transition-all duration-200 active:scale-95"
          >
            Browse Menu
          </button>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-xl shadow-lg p-8 text-center transform hover:scale-105 transition-transform duration-200">
            <div className="bg-secondary rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Clock className="h-8 w-8 text-gray-900" />
            </div>
            <h3 className="text-xl font-bold text-primary mb-2">
              Quick Service
            </h3>
            <p className="text-text-light">
              Order online and pick up fresh, hot meals without the wait
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8 text-center transform hover:scale-105 transition-transform duration-200">
            <div className="bg-secondary rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Award className="h-8 w-8 text-gray-900" />
            </div>
            <h3 className="text-xl font-bold text-primary mb-2">
              Quality Food
            </h3>
            <p className="text-text-light">
              Fresh ingredients and homemade taste in every meal
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8 text-center transform hover:scale-105 transition-transform duration-200">
            <div className="bg-secondary rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <ShoppingCart className="h-8 w-8 text-gray-900" />
            </div>
            <h3 className="text-xl font-bold text-primary mb-2">
              Easy Ordering
            </h3>
            <p className="text-text-light">
              Simple cart system with secure online payment
            </p>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-primary text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to order?</h2>
          <p className="text-lg mb-6 text-gray-200">
            Check out our delicious menu and place your order now!
          </p>
          <button
            onClick={() => navigate("/menu")}
            className="bg-secondary hover:bg-secondary-dark text-gray-900 font-bold px-8 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
          >
            View Menu
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
