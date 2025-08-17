import { useEffect, useState } from "react";
import { parseJwt, API_BASE_URL } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const getInitials = (name?: string, email?: string) => {
  if (name) return name.slice(0, 2).toUpperCase();
  if (email) return email[0].toUpperCase();
  return "U";
};

const Profile = ({ onLogout }: { onLogout: () => void }) => {
  const [user, setUser] = useState<{ email?: string; username?: string; name?: string } | null>(null);

  useEffect(() => {
    // Get user data from localStorage (stored during login/signup)
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        console.log("User data from localStorage:", parsedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error("Error parsing user data:", error);
        setUser({ email: "Unknown", username: "User" });
      }
    } else {
      // Fallback: try to get user from JWT token (for backward compatibility)
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const payload = parseJwt(token);
          console.log("JWT payload (fallback):", payload);
          // JWT only contains ID, so we can't get username/email from it
          setUser({ email: "Unknown", username: "User" });
        } catch (error) {
          console.error("Error parsing JWT:", error);
          setUser({ email: "Unknown", username: "User" });
        }
      }
    }
  }, []);

  if (!user) return null;

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user"); // Also remove user data
    onLogout();
  };

  // Get display name - prioritize username, then name, then fallback
  const displayName = user.username || user.name || 'User';
  const displayEmail = user.email || 'No email';

  return (
    <div className="bg-white rounded-xl shadow-lg p-4 lg:p-6 border border-gray-200">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 lg:gap-6">
        {/* Avatar and User Info */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 lg:gap-4">
          <div className="w-16 h-16 lg:w-20 lg:h-20 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center text-white text-xl lg:text-2xl font-bold shadow-lg">
            {displayName.charAt(0).toUpperCase()}
          </div>
          <div className="text-center sm:text-left">
            <h3 className="text-lg lg:text-xl font-semibold text-gray-800 mb-1">
              {displayName}
            </h3>
            <p className="text-gray-600 text-sm lg:text-base">
              {displayEmail}
            </p>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-2 sm:ml-auto">
          <button
            onClick={() => window.location.href = "/my-designs"}
            className="px-4 lg:px-6 py-2 lg:py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all duration-200 shadow-md hover:shadow-lg text-sm lg:text-base font-medium"
          >
            📁 My Designs
          </button>
          <button
            onClick={handleLogout}
            className="px-4 lg:px-6 py-2 lg:py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all duration-200 shadow-md hover:shadow-lg text-sm lg:text-base font-medium"
          >
            🚪 Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
