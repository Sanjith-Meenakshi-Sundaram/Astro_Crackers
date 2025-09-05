import React, { useState, useEffect } from "react";
import { ChevronRight, Star, Heart, ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

const VITE_API_URL = import.meta.env.VITE_API_URL;

const ProductCard = ({ product, onAddToCart, onToggleWishlist, isWishlisted }) => {
  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden group">
      <div className="relative overflow-hidden">
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-48 sm:h-56 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {product.isBestSeller && (
          <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
            <Star size={12} fill="currentColor" />
            Best Seller
          </div>
        )}
        <button
          onClick={() => onToggleWishlist(product._id)}
          className="absolute top-3 right-3 bg-white/90 hover:bg-white p-2 rounded-full shadow-md transition-all duration-200"
        >
          <Heart
            size={16}
            className={`${isWishlisted ? "fill-red-500 text-red-500" : "text-gray-600"
              } transition-colors`}
          />
        </button>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-gray-800 mb-2 text-sm sm:text-base line-clamp-2">
          {product.name}
        </h3>
        <div className="flex items-center justify-between mb-3">
          <span className="text-lg font-bold text-red-600">
            ₹{product.price}
          </span>
          <div className="flex items-center gap-1 text-yellow-400">
            {[1, 2, 3, 4, 5].map((i) => (
              <Star key={i} size={12} fill="currentColor" />
            ))}
            <span className="text-xs text-gray-500 ml-1">(4.8)</span>
          </div>
        </div>
        <button
          onClick={() => onAddToCart(product)}
          className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors duration-200 font-medium"
        >
          <ShoppingCart size={16} />
          Add to Cart
        </button>
      </div>
    </div>
  );
};

const Home = () => {
  const { user, token } = useAuth();
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Hero images that rotate every 5 seconds
  const heroImages = [
    "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?q=80&w=2070&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1578662996442-48f60103fc96?q=80&w=2070&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?q=80&w=2070&auto=format&fit=crop",
  ];

  // Categories
  const categories = [
    {
      name: "morning crackers",
      image:
        "https://images.unsplash.com/photo-1578662996442-48f60103fc96?q=80&w=800&auto=format&fit=crop",
      description: "Start your day with colorful celebrations",
    },
    {
      name: "night crackers",
      image:
        "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?q=80&w=800&auto=format&fit=crop",
      description: "Illuminate the night sky",
    },
    {
      name: "premium skyshots",
      image:
        "https://images.unsplash.com/photo-1467810563316-b5476525c0f9?q=80&w=800&auto=format&fit=crop",
      description: "Professional grade fireworks",
    },
    {
      name: "kids special",
      image:
        "https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=800&auto=format&fit=crop",
      description: "Safe and fun for little ones",
    },
    {
      name: "gift boxes",
      image:
        "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?q=80&w=800&auto=format&fit=crop",
      description: "Perfect for special occasions",
    },
  ];

  // Auto-rotate hero images every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Fetch featured products and wishlist
  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const response = await axios.get(`${VITE_API_URL}/api/featured`);
        console.log("API Response:", response.data);
        setFeaturedProducts(response.data);
      } catch (err) {
        console.error("Error fetching featured products:", err);
      } finally {
        setLoading(false);
      }
    };

    const fetchWishlist = async () => {
      if (!user || !token) return;

      try {
        const response = await axios.get(`${VITE_API_URL}/api/wishlist`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setWishlistItems(response.data.items || []);
      } catch (err) {
        console.error("Error fetching wishlist:", err);
      }
    };

    fetchFeaturedProducts();
    fetchWishlist();
  }, [user, token]);

  // Check if product is in wishlist
  const isProductWishlisted = (productId) => {
    return wishlistItems.some(item => item.product._id === productId || item.product === productId);
  };

  // Add to cart function
  const handleAddToCart = async (product) => {
    if (!user || !token) {
      alert("Please login to add items to cart");
      return;
    }

    try {
      await axios.post(
        `${VITE_API_URL}/api/cart`,
        { productId: product._id, quantity: 1 },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Show success message
      const successMsg = document.createElement('div');
      successMsg.textContent = 'Added to cart successfully!';
      successMsg.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50';
      document.body.appendChild(successMsg);
      setTimeout(() => successMsg.remove(), 3000);

    } catch (error) {
      console.error("Error adding to cart:", error);

      const errorMsg = document.createElement('div');
      errorMsg.textContent = 'Failed to add to cart. Please try again.';
      errorMsg.className = 'fixed top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg z-50';
      document.body.appendChild(errorMsg);
      setTimeout(() => errorMsg.remove(), 3000);
    }
  };

  // Toggle wishlist function
  const handleToggleWishlist = async (productId) => {
    if (!user || !token) {
      alert("Please login to add items to wishlist");
      return;
    }

    const isWishlisted = isProductWishlisted(productId);

    try {
      if (isWishlisted) {
        // Remove from wishlist
        await axios.delete(`${VITE_API_URL}/api/wishlist/${productId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setWishlistItems(prev => prev.filter(item =>
          (item.product._id || item.product) !== productId
        ));

        const successMsg = document.createElement('div');
        successMsg.textContent = 'Removed from wishlist!';
        successMsg.className = 'fixed top-4 right-4 bg-orange-500 text-white px-4 py-2 rounded-lg shadow-lg z-50';
        document.body.appendChild(successMsg);
        setTimeout(() => successMsg.remove(), 3000);

      } else {
        // Add to wishlist
        const response = await axios.post(
          `${VITE_API_URL}/api/wishlist`,
          { productId },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setWishlistItems(response.data.items || []);

        const successMsg = document.createElement('div');
        successMsg.textContent = 'Added to wishlist!';
        successMsg.className = 'fixed top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg z-50';
        document.body.appendChild(successMsg);
        setTimeout(() => successMsg.remove(), 3000);
      }
    } catch (error) {
      console.error("Error toggling wishlist:", error);

      const errorMsg = document.createElement('div');
      errorMsg.textContent = error.response?.data?.message || 'Failed to update wishlist. Please try again.';
      errorMsg.className = 'fixed top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg z-50';
      document.body.appendChild(errorMsg);
      setTimeout(() => errorMsg.remove(), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative h-[50vh] sm:h-[55vh] lg:h-[60vh] overflow-hidden">
        {heroImages.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-1000 ${index === currentImageIndex ? "opacity-100" : "opacity-0"
              }`}
            style={{
              backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.6)), url('${image}')`,
            }}
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/50 to-black/70"></div>
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-white text-center px-4 max-w-4xl mx-auto">
          <div className="space-y-4 animate-fade-in">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
              <span className="block">STAY WARM,</span>
              <span className="block text-red-400">LOOK COOL</span>
            </h1>
            <p className="text-base sm:text-lg lg:text-xl max-w-3xl leading-relaxed opacity-90">
              Light up your celebrations with the finest selection of crackers
              from Sivakasi.
              <span className="block mt-2">
                Safe, spectacular, and delivered with care.
              </span>
            </p>
            <div className="flex justify-center mt-6">
              <Link
                to="/products"
                className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-full text-base transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
              >
                Discover Collection
              </Link>
            </div>
          </div>
        </div>
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {heroImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentImageIndex
                ? "bg-white scale-110"
                : "bg-white/50 hover:bg-white/80"
                }`}
            />
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="py-12 md:py-20 bg-white">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
              NEW COLLECTIONS
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg leading-relaxed">
              Browse through our curated selection of crackers, gift boxes, and
              more to ensure you're ready for whatever celebration comes your
              way.
            </p>
          </div>
          <div className="block lg:hidden">
            <div className="grid grid-cols-1 gap-6">
              {categories.map((category) => (
                <Link
                  key={category.name}
                  to={`/products?category=${encodeURIComponent(category.name)}`}
                  className="relative rounded-2xl overflow-hidden group h-64 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent">
                    <div className="absolute bottom-6 left-6 right-6">
                      <h3 className="text-white text-xl font-bold mb-2">
                        {category.name}
                      </h3>
                      <p className="text-white/90 text-sm">
                        {category.description}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
          <div className="hidden lg:grid lg:grid-cols-5 gap-6">
            {categories.map((category) => (
              <Link
                key={category.name}
                to={`/products?category=${encodeURIComponent(category.name)}`}
                className="relative rounded-2xl overflow-hidden group h-80 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent">
                  <div className="absolute bottom-6 left-6 right-6">
                    <h3 className="text-white text-lg font-bold mb-2">
                      {category.name}
                    </h3>
                    <p className="text-white/90 text-sm">
                      {category.description}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-12 md:py-20 bg-gray-50">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
              Featured Products
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover our most popular crackers, handpicked for their quality
              and spectacular displays.
            </p>
          </div>

          {loading ? (
            <p className="text-center text-gray-600">Loading products...</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 md:gap-6">
              {featuredProducts.map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  onAddToCart={handleAddToCart}
                  onToggleWishlist={handleToggleWishlist}
                  isWishlisted={isProductWishlisted(product._id)}
                />
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link
              to="/products"
              className="inline-flex items-center font-semibold text-red-600 hover:text-red-800 transition-colors text-lg group"
            >
              View All Products
              <ChevronRight className="w-5 h-5 ml-1 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }
      `}</style>
    </div>
  );
};

export default Home;