import { useEffect, useState } from "react";
import { DesignEditor } from "@/components/design-editor/DesignEditor";
import { useNavigate } from "react-router-dom";
import Profile from "@/components/ui/profile";

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check for token in localStorage (simple check)
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user"); // Also remove user data
    window.location.reload();
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background">
        <h1 className="text-3xl font-bold mb-4">Welcome to Image Palette Lab</h1>
        <div className="flex gap-4">
          <button
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            onClick={() => navigate("/login")}
          >
            Login
          </button>
          <button
            className="px-6 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition"
            onClick={() => navigate("/signup")}
          >
            Sign Up
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-100">
      <div className="max-w-6xl mx-auto p-4 lg:p-8">
        {/* Header */}
        <div className="text-center mb-8 lg:mb-12">
          <h1 className="text-3xl lg:text-5xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
            Image Palette Lab
          </h1>
          <p className="text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto">
            Create stunning designs with our intuitive canvas editor. Draw, shape, and design with ease.
          </p>
        </div>

        {isAuthenticated ? (
          <div className="space-y-6 lg:space-y-8">
            {/* Profile Section */}
            <div className="bg-white rounded-2xl shadow-xl p-4 lg:p-6 border border-gray-100">
              <Profile onLogout={handleLogout} />
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
              <button
                onClick={() => navigate("/canvas")}
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 lg:p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 text-left group"
              >
                <div className="text-3xl lg:text-4xl mb-3">🎨</div>
                <h3 className="text-lg lg:text-xl font-semibold mb-2">Create New Design</h3>
                <p className="text-blue-100 text-sm lg:text-base">Start with a blank canvas and let your creativity flow</p>
              </button>

              {(() => {
                const user = localStorage.getItem("user");
                const role = user ? (JSON.parse(user)?.role as string | undefined) : undefined;
                if (role === "admin") {
                  return (
                    <button
                      onClick={() => navigate("/admin")}
                      className="bg-gradient-to-r from-indigo-500 to-blue-600 text-white p-6 lg:p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 text-left group"
                    >
                      <div className="text-3xl lg:text-4xl mb-3">🛠️</div>
                      <h3 className="text-lg lg:text-xl font-semibold mb-2">Admin Panel</h3>
                      <p className="text-blue-100 text-sm lg:text-base">Manage users and designs</p>
                    </button>
                  );
                }
                return null;
              })()}

              <button
                onClick={() => window.location.href = "/my-designs"}
                className="bg-gradient-to-r from-green-500 to-teal-600 text-white p-6 lg:p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 text-left group"
              >
                <div className="text-3xl lg:text-4xl mb-3">📁</div>
                <h3 className="text-lg lg:text-xl font-semibold mb-2">My Designs</h3>
                <p className="text-green-100 text-sm lg:text-base">View and edit your previously created designs</p>
              </button>

              <button
                onClick={() => {
                  localStorage.removeItem("token");
                  localStorage.removeItem("user"); // Also remove user data
                  window.location.reload();
                }}
                className="bg-gradient-to-r from-red-500 to-pink-600 text-white p-6 lg:p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 text-left group"
              >
                <div className="text-3xl lg:text-4xl mb-3">🚪</div>
                <h3 className="text-lg lg:text-xl font-semibold mb-2">Logout</h3>
                <p className="text-red-100 text-sm lg:text-base">Sign out of your account</p>
              </button>
            </div>
          </div>
        ) : (
          <div className="max-w-md mx-auto">
            <div className="bg-white rounded-2xl shadow-xl p-6 lg:p-8 border border-gray-100">
              <h2 className="text-2xl lg:text-3xl font-bold text-center mb-6 text-gray-800">
                Get Started
              </h2>
              <div className="space-y-4">
                <button
                  onClick={() => window.location.href = "/login"}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 lg:py-4 px-6 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 text-base lg:text-lg"
                >
                  Sign In
                </button>
                <button
                  onClick={() => window.location.href = "/signup"}
                  className="w-full bg-gradient-to-r from-green-500 to-teal-600 text-white py-3 lg:py-4 px-6 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 text-base lg:text-lg"
                >
                  Create Account
                </button>
              </div>
              <p className="text-center text-gray-500 text-sm lg:text-base mt-6">
                Join thousands of creators using Image Palette Lab
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
