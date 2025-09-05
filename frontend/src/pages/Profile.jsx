import React, { useState, useMemo } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Profile = () => {
  const { user, setUser, logout, token } = useAuth();
  const navigate = useNavigate();

  // Form state initialized from context user
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: user?.address || {
      street: "",
      city: "",
      state: "",
      pincode: "",
    },
  });

  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Fixed avatar generation logic - use consistent seed
  const avatarSeed = useMemo(() => {
    return user?.email || user?.name || "default-user";
  }, [user?.email, user?.name]);

  // Updated to use better avatar service with diverse avatars
  const [avatarUrl, setAvatarUrl] = useState(
    user?.avatar || 
    `https://api.dicebear.com/9.x/personas/svg?seed=${encodeURIComponent(avatarSeed)}&backgroundColor=f87171,fca5a5,fecaca&radius=50`
  );

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (["street", "city", "state", "pincode"].includes(name)) {
      setFormData((prev) => ({
        ...prev,
        address: { ...prev.address, [name]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);

      const payload = {
        ...formData,
        avatar: avatarUrl,
      };

      const url = `${import.meta.env.VITE_API_URL}/api/auth/profile`;

      const res = await axios.put(url, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const updatedUser = res.data.user;

      if (setUser) {
        setUser(updatedUser);
      }
      
      try {
        localStorage.setItem("user", JSON.stringify(updatedUser));
      } catch (errLocal) {
        console.warn("Could not write updated user to localStorage", errLocal);
      }

      setIsEditing(false);
      // Show success with a better UX
      const successMsg = document.createElement('div');
      successMsg.textContent = 'Profile updated successfully!';
      successMsg.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50';
      document.body.appendChild(successMsg);
      setTimeout(() => successMsg.remove(), 3000);

    } catch (err) {
      console.error("Profile update failed:", err);
      
      const errorMsg = document.createElement('div');
      errorMsg.textContent = err?.response?.status === 404 
        ? 'API endpoint not found. Check backend connection.' 
        : 'Failed to update profile. Please try again.';
      errorMsg.className = 'fixed top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg z-50';
      document.body.appendChild(errorMsg);
      setTimeout(() => errorMsg.remove(), 3000);
    } finally {
      setLoading(false);
    }
  };

  // Updated changeAvatar function with better avatar service
  const changeAvatar = () => {
    // Generate random diverse avatars
    const timestamp = Date.now();
    const randomSeed = `${avatarSeed}-${timestamp}`;
    
    // Use RoboHash for more diverse, fun avatars (robots, cats, humans, etc.)
    const avatarStyles = ['set1', 'set2', 'set3', 'set4'];
    const randomStyle = avatarStyles[Math.floor(Math.random() * avatarStyles.length)];
    
    const newAvatar = `https://robohash.org/${encodeURIComponent(randomSeed)}.svg?set=${randomStyle}&size=200x200`;
    setAvatarUrl(newAvatar);
    
    // Alternative: Use DiceBear with different styles for more variety
    // const styles = ['personas', 'avataaars', 'big-smile', 'fun-emoji'];
    // const randomStyleDB = styles[Math.floor(Math.random() * styles.length)];
    // const newAvatar = `https://api.dicebear.com/9.x/${randomStyleDB}/svg?seed=${encodeURIComponent(randomSeed)}&backgroundColor=f87171,fca5a5,fecaca&radius=50`;
    // setAvatarUrl(newAvatar);
  };

  const cancelEdit = () => {
    // Reset form data to original user data
    setFormData({
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
      address: user?.address || {
        street: "",
        city: "",
        state: "",
        pincode: "",
      },
    });
    setIsEditing(false);
  };

  return (
    <div className="w-full max-w-md mx-auto mt-6 mb-20">
      {/* Compact Profile Card */}
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
        
        {/* Header Section - Changed to Red Theme */}
        <div className="relative bg-gradient-to-r from-red-500 to-red-600 h-20">
          <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2">
            <div className="relative">
              <img
                src={avatarUrl}
                alt="Profile Avatar"
                className="w-16 h-16 rounded-full border-4 border-white shadow-lg bg-white"
                onError={(e) => {
                  e.target.src = `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(user?.name || 'User')}&backgroundColor=ef4444`;
                }}
              />
              
              {/* Change Avatar Button - Always Visible */}
              <button
                onClick={changeAvatar}
                className="absolute -bottom-1 -right-1 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full text-xs flex items-center justify-center shadow-md transition-colors"
                title="Change avatar"
              >
                ↻
              </button>
            </div>
          </div>
        </div>

        {/* Profile Info */}
        <div className="pt-12 pb-6 px-6">
          <div className="text-center mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-1">
              {user?.name || 'User'}
            </h2>
            <p className="text-sm text-gray-500">{user?.email}</p>
          </div>

          {/* Form Fields */}
          <div className="space-y-4">
            
            {/* Name Field */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                disabled={!isEditing}
                className={`w-full px-3 py-2 text-sm border rounded-lg transition-colors focus:outline-none ${
                  isEditing 
                    ? 'border-gray-300 focus:border-red-500 focus:ring-1 focus:ring-red-500' 
                    : 'border-gray-200 bg-gray-50'
                }`}
                placeholder="Enter your full name"
              />
            </div>

            {/* Phone Field */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Phone Number</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                disabled={!isEditing}
                className={`w-full px-3 py-2 text-sm border rounded-lg transition-colors focus:outline-none ${
                  isEditing 
                    ? 'border-gray-300 focus:border-red-500 focus:ring-1 focus:ring-red-500' 
                    : 'border-gray-200 bg-gray-50'
                }`}
                placeholder="+91 9876543210"
              />
            </div>

            {/* Address Section */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Address</label>
              
              {/* Street */}
              <input
                type="text"
                name="street"
                value={formData.address.street || ""}
                onChange={handleChange}
                disabled={!isEditing}
                className={`w-full px-3 py-2 text-sm border rounded-lg mb-2 transition-colors focus:outline-none ${
                  isEditing 
                    ? 'border-gray-300 focus:border-red-500 focus:ring-1 focus:ring-red-500' 
                    : 'border-gray-200 bg-gray-50'
                }`}
                placeholder="Street address"
              />
              
              {/* City, State, Pincode Grid */}
              <div className="grid grid-cols-3 gap-2">
                <input
                  type="text"
                  name="city"
                  value={formData.address.city || ""}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className={`px-3 py-2 text-sm border rounded-lg transition-colors focus:outline-none ${
                    isEditing 
                      ? 'border-gray-300 focus:border-red-500 focus:ring-1 focus:ring-red-500' 
                      : 'border-gray-200 bg-gray-50'
                  }`}
                  placeholder="City"
                />
                <input
                  type="text"
                  name="state"
                  value={formData.address.state || ""}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className={`px-3 py-2 text-sm border rounded-lg transition-colors focus:outline-none ${
                    isEditing 
                      ? 'border-gray-300 focus:border-red-500 focus:ring-1 focus:ring-red-500' 
                      : 'border-gray-200 bg-gray-50'
                  }`}
                  placeholder="State"
                />
                <input
                  type="text"
                  name="pincode"
                  value={formData.address.pincode || ""}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className={`px-3 py-2 text-sm border rounded-lg transition-colors focus:outline-none ${
                    isEditing 
                      ? 'border-gray-300 focus:border-red-500 focus:ring-1 focus:ring-red-500' 
                      : 'border-gray-200 bg-gray-50'
                  }`}
                  placeholder="PIN"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex gap-2">
            {!isEditing ? (
              <>
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex-1 py-2 px-4 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors"
                >
                  Edit Profile
                </button>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 border border-gray-300 hover:bg-gray-50 text-gray-700 text-sm font-medium rounded-lg transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="flex-1 py-2 px-4 bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition-colors"
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  onClick={cancelEdit}
                  disabled={loading}
                  className="px-4 py-2 border border-gray-300 hover:bg-gray-50 disabled:opacity-50 text-gray-700 text-sm font-medium rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Support Info */}
      {import.meta.env.VITE_SUPPORT_PHONE && (
        <div className="mt-4 text-center">
          <p className="text-xs text-gray-500">
            Need help? Contact: 
            <span className="text-red-600 font-medium ml-1">
              {import.meta.env.VITE_SUPPORT_PHONE}
            </span>
          </p>
        </div>
      )}
    </div>
  );
};

export default Profile;