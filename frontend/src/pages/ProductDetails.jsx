import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Heart, ShoppingCart, Share, Star, Truck, Shield, RotateCcw } from "lucide-react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [currentImage, setCurrentImage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [inWishlist, setInWishlist] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isAddingToWishlist, setIsAddingToWishlist] = useState(false);

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchProduct();
    if (token) {
      checkWishlistStatus();
    }
  }, [id, token]);

  const fetchProduct = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/products/${id}`);
      if (res.data) {
        setProduct(res.data);
      } else {
        setError("Product not found");
      }
    } catch (err) {
      console.error("Error fetching product:", err);
      if (err.response?.status === 404) {
        setError("Product not found");
      } else {
        setError("Failed to load product");
      }
    } finally {
      setLoading(false);
    }
  };

  const checkWishlistStatus = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/wishlist`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const wishlistItems = response.data.items || [];
      const isInWishlist = wishlistItems.some(item =>
        item.product?._id === id ||
        item.productId === id ||
        item._id === id
      );
      setInWishlist(isInWishlist);
    } catch (err) {
      console.error("Error checking wishlist status:", err);
    }
  };

  const handleAddToCart = async () => {
    if (!token) {
      alert("Please login to add to cart");
      return;
    }

    setIsAddingToCart(true);
    try {
      await axios.post(
        `${API_URL}/api/cart`,
        { productId: id, quantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Added to cart successfully!");
    } catch (err) {
      console.error("Error adding to cart:", err);
      if (err.response?.status === 400 && err.response?.data?.message) {
        alert(err.response.data.message);
      } else {
        alert("Failed to add to cart");
      }
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleWishlistToggle = async () => {
    if (!token) {
      alert("Please login to use wishlist");
      return;
    }

    setIsAddingToWishlist(true);
    try {
      if (inWishlist) {
        await axios.delete(`${API_URL}/api/wishlist/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setInWishlist(false);
        alert("Removed from wishlist");
      } else {
        await axios.post(
          `${API_URL}/api/wishlist`,
          { productId: id },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setInWishlist(true);
        alert("Added to wishlist!");
      }
    } catch (err) {
      console.error("Wishlist error:", err);
      if (err.response?.status === 400 && err.response?.data?.message) {
        if (err.response.data.message.includes("already") && !inWishlist) {
          setInWishlist(true);
        } else {
          alert(err.response.data.message);
        }
      } else {
        alert("Failed to update wishlist");
      }
    } finally {
      setIsAddingToWishlist(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-sm">Loading product...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Product Not Found</h2>
          <p className="text-gray-600 mb-6">The product you're looking for doesn't exist or has been removed.</p>
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // Safe image handling
  const productImages = product.images && product.images.length > 0
    ? product.images
    : ["https://placehold.co/400x400/f3f4f6/6b7280?text=No+Image"];

  // Calculate pricing
  const sellingPrice = product.price || 0;
  const discount = product.discount || 0;
  const originalPrice = discount > 0 ? Math.round((sellingPrice * 100) / (100 - discount)) : 0;

  return (
    <div className="min-h-screen bg-gray-50 pb-20"> {/* Added pb-20 for bottom navigation space */}
      <div className="max-w-6xl mx-auto px-4 py-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-700 hover:text-red-600 transition-colors"
          >
            <ArrowLeft size={20} className="mr-2" />
            Back
          </button>
          <button
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: product.name,
                  url: window.location.href,
                });
              } else {
                navigator.clipboard.writeText(window.location.href);
                alert("Link copied to clipboard!");
              }
            }}
            className="p-2 text-gray-600 hover:text-red-600 transition-colors"
          >
            <Share size={20} />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="relative bg-white rounded-lg overflow-hidden shadow-sm">
              <img
                src={productImages[currentImage]}
                alt={product.name}
                className="w-full h-80 md:h-96 object-contain p-4"
                onError={(e) => {
                  e.target.src = "https://placehold.co/400x400/f3f4f6/6b7280?text=Error";
                }}
              />

              {/* Image indicators */}
              {productImages.length > 1 && (
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                  {productImages.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentImage(idx)}
                      className={`w-2 h-2 rounded-full ${currentImage === idx ? "bg-red-600" : "bg-gray-300"
                        }`}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Thumbnail Gallery */}
            {productImages.length > 1 && (
              <div className="flex space-x-3 overflow-x-auto pb-2">
                {productImages.map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    alt={`View ${idx + 1}`}
                    onClick={() => setCurrentImage(idx)}
                    className={`w-16 h-16 object-cover rounded-lg cursor-pointer border-2 flex-shrink-0 ${currentImage === idx ? "border-red-500" : "border-gray-200"
                      }`}
                    onError={(e) => {
                      e.target.src = "https://placehold.co/64x64/f3f4f6/6b7280?text=Error";
                    }}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              {product.category && (
                <span className="text-sm text-gray-500 uppercase tracking-wide font-medium">
                  {product.category}
                </span>
              )}
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mt-2 leading-tight">
                {product.name}
              </h1>

              {/* Rating */}
              {product.rating && (
                <div className="flex items-center gap-2 mt-3">
                  <div className="flex items-center gap-1 bg-green-600 text-white px-2 py-1 rounded text-sm font-medium">
                    <span>{product.rating}</span>
                    <Star size={12} className="fill-white" />
                  </div>
                  <span className="text-gray-500 text-sm">({product.reviews || 0} reviews)</span>
                </div>
              )}
            </div>

            {/* Pricing */}
            <div className="flex items-center gap-3">
              <span className="text-3xl font-bold text-red-600">₹{sellingPrice}</span>
              {originalPrice > sellingPrice && (
                <>
                  <span className="text-xl text-gray-400 line-through">₹{originalPrice}</span>
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm font-medium">
                    {discount}% OFF
                  </span>
                </>
              )}
            </div>

            {/* Description */}
            {product.description && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
                <p className="text-gray-600 leading-relaxed">{product.description}</p>
              </div>
            )}

            

            {/* Quantity Selector */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
              <div className="flex items-center border border-gray-300 rounded-lg w-fit">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-2 hover:bg-gray-100 transition-colors"
                >
                  −
                </button>
                <span className="px-4 py-2 font-medium">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-2 hover:bg-gray-100 transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={handleAddToCart}
                disabled={isAddingToCart}
                className="w-full bg-red-600 text-white py-3 rounded-lg font-medium hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <ShoppingCart size={18} />
                {isAddingToCart ? "Adding..." : "Add to Cart"}
              </button>

              <button
                onClick={handleWishlistToggle}
                disabled={isAddingToWishlist}
                className={`w-full py-3 rounded-lg font-medium border transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${inWishlist
                    ? "bg-red-50 border-red-300 text-red-600"
                    : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                  }`}
              >
                <Heart size={18} className={inWishlist ? "fill-red-600" : ""} />
                {isAddingToWishlist
                  ? "Updating..."
                  : inWishlist
                    ? "Remove from Wishlist"
                    : "Add to Wishlist"
                }
              </button>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="flex items-center gap-3 bg-white p-4 rounded-lg shadow-sm">
            <Shield size={24} className="text-blue-600" />
            <div>
              <p className="font-medium text-gray-900">Quality Assured</p>
              <p className="text-sm text-gray-500">Quality Checked for Your Safety</p>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-white p-4 rounded-lg shadow-sm">
            <RotateCcw size={24} className="text-orange-600" />
            <div>
              <p className="font-medium text-gray-900">Safe Delivery</p>
              <p className="text-sm text-gray-500">Hassle-Free Delivery Across India</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;