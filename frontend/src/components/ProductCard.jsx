import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Heart, Star, ShoppingCart, Eye } from "lucide-react";
import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;

const ProductCard = ({ product }) => {
  if (!product) return null;

  const [inWishlist, setInWishlist] = useState(false);
  const [isWishlistLoading, setIsWishlistLoading] = useState(false);

  // Get token from localStorage
  const token = localStorage.getItem("token");

  // Calculate original price (assuming 80% discount for now - you can make this dynamic)
  const sellingPrice = product.price;
  const discount = product.discount || 80; // Default 80% or from backend
  const originalPrice = Math.round((sellingPrice * 100) / (100 - discount));
  const discountPercentage = Math.round(((originalPrice - sellingPrice) / originalPrice) * 100);

  // Check if product is in wishlist when component mounts
  useEffect(() => {
    const checkWishlistStatus = async () => {
      if (!token || !product._id) return;
      
      try {
        const response = await axios.get(`${API_URL}/api/wishlist`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        // Check if current product is in the wishlist
        const isInWishlist = response.data.some(item => 
          item.productId === product._id || item._id === product._id || item.product?._id === product._id
        );
        setInWishlist(isInWishlist);
      } catch (err) {
        console.error("Error checking wishlist status:", err);
        // Don't show alert for this error, just log it
      }
    };

    checkWishlistStatus();
  }, [token, product._id]);

  // Toggle wishlist with better error handling
  const handleWishlistToggle = async () => {
    try {
      if (!token) {
        alert("Please login to use wishlist");
        return;
      }

      setIsWishlistLoading(true);

      if (inWishlist) {
        // Remove from wishlist
        await axios.delete(`${API_URL}/api/wishlist/${product._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setInWishlist(false);
      } else {
        // Add to wishlist
        await axios.post(
          `${API_URL}/api/wishlist`,
          { productId: product._id },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setInWishlist(true);
      }
    } catch (err) {
      console.error("Wishlist error:", err);
      
      // Better error handling based on error type
      if (err.response?.status === 400 && err.response?.data?.message) {
        // Handle specific backend errors (like "already in wishlist")
        console.log("Backend message:", err.response.data.message);
        // Don't show alert for "already exists" errors, just toggle the state
        if (err.response.data.message.includes("already") && !inWishlist) {
          setInWishlist(true);
        } else if (err.response.data.message.includes("not found") && inWishlist) {
          setInWishlist(false);
        } else {
          alert(err.response.data.message);
        }
      } else if (err.response?.status === 404) {
        // Product not found in wishlist when trying to remove
        setInWishlist(false);
        alert("Item was already removed from wishlist");
      } else if (err.response?.status === 409) {
        // Conflict - item already exists
        setInWishlist(true);
      } else {
        alert("Something went wrong with wishlist operation!");
      }
    } finally {
      setIsWishlistLoading(false);
    }
  };

  // Add to Cart with better error handling
  const handleAddToCart = async () => {
    try {
      if (!token) {
        alert("Please login to add to cart");
        return;
      }

      await axios.post(
        `${API_URL}/api/cart`,
        { productId: product._id, quantity: 1 },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("Added to cart ✅");
    } catch (err) {
      console.error("Cart error:", err);
      
      if (err.response?.status === 400 && err.response?.data?.message) {
        alert(err.response.data.message);
      } else {
        alert("Something went wrong while adding to cart!");
      }
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 hover:border-red-300 hover:shadow-lg overflow-hidden group transition-all duration-300 relative">
      {/* Top badges and wishlist */}
      <div className="absolute top-2 left-2 right-2 flex justify-between items-start z-10">
        <div className="flex flex-col gap-1">
          {product.isBestSeller && (
            <span className="bg-red-600 text-white text-xs px-2 py-1 rounded-full font-medium shadow-sm">
              ★ Bestseller
            </span>
          )}
          {discountPercentage > 0 && (
            <span className="bg-green-600 text-white text-xs px-2 py-1 rounded-full font-medium shadow-sm">
              {discountPercentage}% OFF
            </span>
          )}
        </div>
        
        <button
          onClick={handleWishlistToggle}
          disabled={isWishlistLoading}
          className={`bg-white/90 backdrop-blur-sm p-1.5 rounded-full shadow-sm hover:bg-white transition-colors ${
            isWishlistLoading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          <Heart
            size={16}
            className={inWishlist ? "text-red-600 fill-red-600" : "text-gray-600"}
          />
        </button>
      </div>

      <Link to={`/products/${product._id}`}>
        <div className="relative bg-gray-50">
          <img
            src={
              product.images?.[0] ||
              "https://placehold.co/300x300/f3f4f6/6b7280?text=No+Image"
            }
            alt={product.name || "Product Image"}
            className="w-full h-44 object-contain p-2 group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "https://placehold.co/300x300/f3f4f6/6b7280?text=Error";
            }}
          />
          
          {/* Quick view overlay on hover */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
            <div className="flex gap-2">
              <div className="bg-white p-2 rounded-full shadow-lg">
                <Eye size={16} className="text-gray-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="p-3">
          {/* Product category/brand */}
          {product.category && (
            <p className="text-gray-500 text-xs font-medium uppercase tracking-wide mb-1">
              {product.category}
            </p>
          )}
          
          {/* Product name */}
          <h3 className="text-gray-800 font-medium text-sm leading-tight mb-2 line-clamp-2 group-hover:text-red-600 transition-colors">
            {product.name}
          </h3>
          
          {/* Rating (if available) */}
          {product.rating && (
            <div className="flex items-center gap-1 mb-2">
              <div className="flex items-center gap-0.5 bg-green-600 text-white px-1.5 py-0.5 rounded text-xs font-medium">
                <span>{product.rating}</span>
                <Star size={10} className="fill-white" />
              </div>
              <span className="text-gray-500 text-xs">({product.reviews || 0})</span>
            </div>
          )}
          
          {/* Price section */}
          <div className="flex items-center gap-2 mb-3">
            <span className="text-green-700 font-bold text-lg">₹{sellingPrice}</span>
            {originalPrice > sellingPrice && (
              <span className="text-gray-400 font-medium text-sm line-through">₹{originalPrice}</span>
            )}
          </div>
          
          {/* Features/highlights */}
          {product.tags && product.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {product.tags.slice(0, 2).map((tag, index) => (
                <span 
                  key={index}
                  className="text-xs bg-red-50 text-red-600 px-2 py-0.5 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </Link>

      {/* Action buttons */}
      <div className="p-3 pt-0 flex gap-2">
        <button
          onClick={handleAddToCart}
          className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-3 rounded-md text-sm font-medium transition-colors flex items-center justify-center gap-1.5"
        >
          <ShoppingCart size={14} />
          Add to Cart
        </button>
        
        <Link 
          to={`/products/${product._id}`}
          className="px-3 py-2 border border-red-600 text-red-600 hover:bg-red-50 rounded-md text-sm font-medium transition-colors flex items-center justify-center"
        >
          <Eye size={14} />
        </Link>
      </div>
      
      {/* Delivery info */}
      <div className="px-3 pb-3">
        <p className="text-xs text-gray-500 flex items-center gap-1">
          <span className="w-2 h-2 bg-green-500 rounded-full"></span>
          Fast Festival Delivery
        </p>
      </div>
    </div>
  );
};

export default ProductCard;