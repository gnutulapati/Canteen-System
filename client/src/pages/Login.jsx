import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { LogIn } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const { loginWithGoogle, isAuthenticated, user } = useAuth();

  const handleLogin = async () => {
    try {
      await loginWithGoogle();
      navigate("/menu");
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  if (isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
          <div className="mb-6">
            <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-4xl">✓</span>
            </div>
            <h2 className="text-2xl font-bold text-primary mb-2">
              Already Logged In
            </h2>
            <p className="text-text-light">Welcome back, {user?.name}!</p>
          </div>
          <button
            onClick={() => navigate("/menu")}
            className="w-full bg-secondary hover:bg-secondary-dark text-gray-900 font-bold py-3 rounded-lg transition-colors duration-200"
          >
            Go to Menu
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
            <LogIn className="h-10 w-10 text-gray-900" />
          </div>
          <h1 className="text-3xl font-bold text-primary mb-2">
            Welcome to SRCM Canteen
          </h1>
          <p className="text-text-light">
            Sign in with your Google account to continue
          </p>
        </div>

        <button
          onClick={handleLogin}
          className="w-full bg-secondary hover:bg-secondary-dark text-gray-900 font-bold py-4 rounded-lg flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transition-all duration-200 active:scale-95"
        >
          <svg className="h-6 w-6" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="currentColor"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="currentColor"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="currentColor"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Sign in with Google
        </button>

        <p className="text-xs text-text-light text-center mt-6">
          By signing in, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
};

export default Login;
