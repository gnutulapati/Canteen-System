import { useNavigate } from "react-router-dom";
import { ShieldAlert } from "lucide-react";

const AccessDenied = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-md text-center">
        <div className="w-20 h-20 bg-accent-light rounded-full flex items-center justify-center mx-auto mb-4">
          <ShieldAlert className="h-10 w-10 text-accent" />
        </div>
        <h1 className="text-2xl font-bold text-primary mb-2">Access Denied</h1>
        <p className="text-text-light mb-6">
          You don't have permission to access this page. This area is restricted
          to administrators only.
        </p>
        <button
          onClick={() => navigate("/")}
          className="bg-secondary hover:bg-secondary-dark text-gray-900 font-bold px-6 py-3 rounded-lg transition-colors duration-200"
        >
          Go to Home
        </button>
      </div>
    </div>
  );
};

export default AccessDenied;
