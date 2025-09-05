import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Heart } from "lucide-react"; // heart icon
import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;


const ProductCard = ({ product }) => {
  if (!product) return null;

  const [inWishlist, setInWishlist] = useState(false);

  // Get token from localStorage
  const token = localStorage.getItem("token");

  // Toggle wishlist
  const handleWishlistToggle = async () => {
    try {
      if (!token) {
        alert("Please login to use wishlist");
        return;
      }

      if (inWishlist) {
        // remove from wishlist
        await axios.delete(`${API_URL}/api/wishlist/${product._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setInWishlist(false);
      } else {
        // add to wishlist
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
      alert("Something went wrong with wishlist!");
    }
  };

  // Add to Cart
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
      alert("Something went wrong while adding to cart!");
    }
  };

  return (
    <div className="bg-white rounded-lg shadow hover:shadow-lg overflow-hidden group transition-transform transform hover:-translate-y-1 relative">
      {/* Wishlist button */}
      <button
        onClick={handleWishlistToggle}
        className="absolute top-2 right-2 bg-white p-1 rounded-full shadow hover:bg-gray-100 z-10"
      >
        <Heart
          size={20}
          className={inWishlist ? "text-red-600 fill-red-600" : "text-gray-600"}
        />
      </button>

      <Link to={`/products/${product._id}`}>
        <div className="relative">
          <img
            src={
              product.images?.[0] ||
              "https://placehold.co/400x400/ef4444/ffffff?text=No+Image"
            }
            alt={product.name || "Product Image"}
            className="w-full h-48 object-cover"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src =
                "https://placehold.co/400x400/ef4444/ffffff?text=Error";
            }}
          />
          {product.isBestSeller && (
            <span className="absolute top-2 left-2 bg-red-600 text-white text-xs px-2 py-1 rounded font-bold">
              Bestseller
            </span>
          )}
        </div>

        <div className="p-4">
          <h3 className="text-gray-800 font-semibold text-sm md:text-base truncate">
            {product.name}
          </h3>
          <p className="text-red-600 font-bold mt-1">₹{product.price}</p>
        </div>
      </Link>

      {/* Add to Cart button */}
      <div className="px-4 pb-4">
        <button
          onClick={handleAddToCart}
          className="w-full bg-gray-900 text-white py-2 rounded-lg text-sm font-semibold hover:bg-red-600 transition-colors"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
