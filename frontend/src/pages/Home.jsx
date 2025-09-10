import React, { useState, useEffect } from "react";
import { ChevronRight, Star, Heart, ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import "./Home.css";
import ProductCardFeatured from "../components/ProductCardFeatured";

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

  // Hero images - replace with your actual image paths
  const heroImages = [
    "/coverphoto2_astro.png", // Replace with your actual image path
    "/coverphoto2_astro.png" // Replace with your actual image path  
  ];

  // Categories
  const categories = [
    {
      name: "morning crackers",
      image:
        "https://i.pinimg.com/736x/4f/1b/0e/4f1b0e729fe0ee0275eecc7368dc1df6.jpg",
      description: "Begin your day with 1000-walas, Lakshmi crackers — best enjoyed in the early morning hours of Diwali.",
    },
    {
      name: "night crackers",
      image:
        "https://media.istockphoto.com/id/494984843/photo/festival-of-light-diwali.jpg?s=612x612&w=0&k=20&c=FGUKnjvQKhMHzxh-sJv6WxP0vPIBVgJ41GdUHsoO6DI=",
      description: "Light up the night sky with dazzling Chakras, Flowerpots, and Rockets for grand celebrations.",
    },
    {
      name: "premium skyshots",
      image:
        "https://cdn.dotpe.in/longtail/store-items/7873975/ZjDzmJZd.jpeg",
      description: "Experience spectacular aerial shells and multi-shot fireworks",
    },
    {
      name: "kids special",
      image:
        "https://img.freepik.com/premium-photo/kids-celebrate-diwali-with-crackers-road_349936-1006.jpg",
      description: "Fun and safe options like Sparklers, Ground Spinners, and Pencil crackers designed especially for children.",
    },
    {
      name: "gift boxes",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRq6V6RruidXmJ_Fbvb2idI1Bv7nQ9f2A-OIg&s",
      description: "Beautifully packed assortments of all-time favorite crackers — perfect for gifting during Diwali and festivals.",
    },
  ];

  // Auto-rotate hero images every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  // Fetch featured products and wishlist
  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const response = await axios.get(`${VITE_API_URL}/api/featured`);
        // console.log("API Response:", response.data);
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
    return wishlistItems?.some(
      (item) =>
        item &&
        (item.product?._id === productId || item.product === productId)
    ) || false;
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

        setWishlistItems((prev) =>
          prev.filter(
            (item) =>
              item &&
              (item.product?._id || item.product) !== productId
          )
        );

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
      {/* Hero Section with Red Background Fix */}
      <section className="relative w-full lg:h-[60vh] h-[134px] overflow-hidden">

        {/* Fireworks Background */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0"
          style={{
            backgroundImage: `url('https://static.vecteezy.com/system/resources/previews/038/466/539/non_2x/vibrant-red-fireworks-illuminating-the-night-sky-in-a-celebratory-burst-of-golden-explosions-perfect-for-chinese-new-year-vector.jpg')`,
          }}
        />

        {/* Transparent dark overlay (keeps fireworks visible) */}
        <div className="absolute inset-0 bg-black/10 z-10"></div>

        {/* Hero Images Carousel (on top of overlay) */}
        {heroImages.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-1000 ${index === currentImageIndex ? "opacity-100" : "opacity-0"
              }`}
            style={{
              backgroundImage: `url('${image}')`,
            }}
          />
        ))}

        {/* Quick Order Button */}
        <Link
          to="/quickorder"
          className="absolute bottom-0 right-0 z-30 transition-all duration-300 transform hover:scale-110 hover:drop-shadow-xl"
        >
          <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-full overflow-hidden bg-white flex items-center justify-center animate-shake">
            <img
              src="/quickorder2.png"
              alt="Quick Order"
              className="h-full w-full object-cover transition-all duration-300 cursor-pointer hover:brightness-110"
            />
          </div>
        </Link>

        {/* Carousel Indicators */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2 z-30">
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

      {/* Hero Content Section - Slim Version */}
      <section className="py-4 bg-white">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="relative rounded-xl overflow-hidden group h-16 md:h-20 shadow-md hover:shadow-lg transition-all duration-300 border border-red-500">
            {/* Background with gradient overlay */}
            <div
              className="w-full h-full bg-cover bg-center bg-no-repeat transition-transform duration-500 group-hover:scale-105"
              style={{
                backgroundImage: `linear-gradient(135deg, rgba(220, 38, 38, 0.9), rgba(185, 28, 28, 0.8)), url('https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?q=80&w=1200&auto=format&fit=crop')`
              }}
            />

            {/* Content overlay */}
            <div className="absolute inset-0 flex items-center justify-between px-4 md:px-8">
              <div className="text-white">
                <h1 className="text-base md:text-lg font-bold leading-snug">
                  SIVAKASI CRACKERS
                </h1>
                <p className="text-white/90 text-[11px] md:text-sm leading-snug">
                  Safe • Spectacular • Delivered with care
                </p>
              </div>

              <div className="hidden md:block">
                <Link
                  to="/products"
                  className="bg-white text-red-600 hover:bg-gray-100 font-semibold py-1.5 px-4 rounded-md text-xs transition-all duration-300 transform hover:scale-105 hover:shadow-md whitespace-nowrap"
                >
                  Show all
                </Link>
              </div>
            </div>

            {/* Mobile button */}
            <div className="md:hidden absolute bottom-1 right-2">
              <Link
                to="/products"
                className="bg-white text-red-600 hover:bg-gray-100 font-semibold py-1 px-3 rounded text-[10px] transition-all duration-300 transform hover:scale-105 whitespace-nowrap"
              >
                Show all
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Content */}
      <section className="bg-white">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="block lg:hidden">
            <div className="grid grid-cols-1 gap-6">
              {categories.map((category) => (
                <Link
                  key={category.name}
                  to={`/products?category=${encodeURIComponent(category.name)}`}
                  className="relative rounded-2xl overflow-hidden group h-64 shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-red-500"
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
                className="relative rounded-2xl overflow-hidden group h-80 shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-red-500"
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
      <section className="py-12 md:py-16 bg-gray-50">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-4">
            <div className="relative inline-block px-3 py-1.5 border-2 border-red-600 rounded-lg bg-gradient-to-r from-white via-red-50 to-white shadow-md animate-pulse-slow">

              <span className="absolute top-0 left-0 w-1.5 h-1.5 bg-red-600 rounded-br-md"></span>
              <span className="absolute top-0 right-0 w-1.5 h-1.5 bg-red-600 rounded-bl-md"></span>
              <span className="absolute bottom-0 left-0 w-1.5 h-1.5 bg-red-600 rounded-tr-md"></span>
              <span className="absolute bottom-0 right-0 w-1.5 h-1.5 bg-red-600 rounded-tl-md"></span>

              <h2 className="text-xl font-extrabold text-red-600 tracking-normal mb-0.5 animate-fade-in">
                Featured Products
              </h2>

              <p className="text-gray-600 text-[9px] font-medium leading-tight animate-slide-up">
                Discover our most popular crackers, handpicked for quality.
              </p>

            </div>
          </div>

          {loading ? (
            <p className="text-center text-gray-600">Loading products...</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 md:gap-6">
              {featuredProducts.map((product) => (
                <ProductCardFeatured
                  key={product._id}
                  product={product}
                  onAddToCart={handleAddToCart}
                  onToggleWishlist={handleToggleWishlist}
                  isWishlisted={isProductWishlisted(product._id)}
                />
              ))}
            </div>
          )}

          <div className="text-center mt-10">
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