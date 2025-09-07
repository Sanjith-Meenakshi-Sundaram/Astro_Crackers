import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { Search as SearchIcon, Filter, X, Heart, ShoppingCart, Star, Eye,ArrowLeft } from 'lucide-react';
import { searchProducts } from '../services/product.service';
import { CATEGORIES, PRICE_RANGES } from '../utils/constant';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

// Enhanced ProductCard with working cart/wishlist
const ProductCard = ({ product }) => {
  const [inWishlist, setInWishlist] = useState(false);
  const [isWishlistLoading, setIsWishlistLoading] = useState(false);
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (token && product._id) {
      checkWishlistStatus();
    }
  }, [token, product._id]);

  const checkWishlistStatus = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/wishlist`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const isInWishlist = response.data.some(item =>
        item.productId === product._id || item._id === product._id || item.product?._id === product._id
      );
      setInWishlist(isInWishlist);
    } catch (err) {
      console.error("Error checking wishlist status:", err);
    }
  };

  const handleWishlistToggle = async () => {
    if (!token) {
      alert("Please login to use wishlist");
      return;
    }

    setIsWishlistLoading(true);
    try {
      if (inWishlist) {
        await axios.delete(`${API_URL}/api/wishlist/${product._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setInWishlist(false);
        alert("Removed from wishlist");
      } else {
        await axios.post(
          `${API_URL}/api/wishlist`,
          { productId: product._id },
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
        alert("Something went wrong with wishlist!");
      }
    } finally {
      setIsWishlistLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!token) {
      alert("Please login to add to cart");
      return;
    }

    try {
      await axios.post(
        `${API_URL}/api/cart`,
        { productId: product._id, quantity: 1 },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Added to cart successfully!");
    } catch (err) {
      console.error("Cart error:", err);
      if (err.response?.status === 400 && err.response?.data?.message) {
        alert(err.response.data.message);
      } else {
        alert("Something went wrong while adding to cart!");
      }
    }
  };

  const sellingPrice = product.price || 0;
  const discount = product.discount || 0;
  const originalPrice = discount > 0 ? Math.round((sellingPrice * 100) / (100 - discount)) : 0;
  const discountPercentage = Math.round(((originalPrice - sellingPrice) / originalPrice) * 100);

  return (
    <div className="bg-white rounded-lg border border-gray-200 hover:border-red-300 hover:shadow-md overflow-hidden group transition-all duration-300 relative">
      {/* Top badges and wishlist */}
      <div className="absolute top-2 left-2 right-2 flex justify-between items-start z-10">
        <div className="flex flex-col gap-1">
          {product.isBestSeller && (
            <span className="bg-red-600 text-white text-xs px-2 py-0.5 rounded-full font-medium shadow-sm">
              ★ Bestseller
            </span>
          )}
          {discountPercentage > 0 && (
            <span className="bg-green-600 text-white text-xs px-2 py-0.5 rounded-full font-medium shadow-sm">
              {discountPercentage}% OFF
            </span>
          )}
        </div>

        <button
          onClick={handleWishlistToggle}
          disabled={isWishlistLoading}
          className={`bg-white/90 backdrop-blur-sm p-1.5 rounded-full shadow-sm hover:bg-white transition-colors ${isWishlistLoading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
        >
          <Heart
            size={14}
            className={inWishlist ? "text-red-600 fill-red-600" : "text-gray-600"}
          />
        </button>
      </div>

      <Link to={`/products/${product._id}`}>
        <div className="relative bg-gray-50">
          <img
            src={product.images?.[0] || "https://placehold.co/300x300/f3f4f6/6b7280?text=No+Image"}
            alt={product.name || "Product Image"}
            className="w-full h-36 object-contain p-2 group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "https://placehold.co/300x300/f3f4f6/6b7280?text=Error";
            }}
          />

          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
            <div className="bg-white p-2 rounded-full shadow-lg">
              <Eye size={14} className="text-gray-600" />
            </div>
          </div>
        </div>

        <div className="p-3">
          {product.category && (
            <p className="text-gray-500 text-xs font-medium uppercase tracking-wide mb-1">
              {product.category}
            </p>
          )}

          <h3 className="text-gray-800 font-medium text-sm leading-tight mb-2 line-clamp-2 group-hover:text-red-600 transition-colors">
            {product.name}
          </h3>

          {product.rating && (
            <div className="flex items-center gap-1 mb-2">
              <div className="flex items-center gap-0.5 bg-green-600 text-white px-1.5 py-0.5 rounded text-xs font-medium">
                <span>{product.rating}</span>
                <Star size={9} className="fill-white" />
              </div>
              <span className="text-gray-500 text-xs">({product.reviews || 0})</span>
            </div>
          )}

          <div className="flex items-center gap-2 mb-3">
            <span className="text-green-700 font-bold text-base">₹{sellingPrice}</span>
            {originalPrice > sellingPrice && (
              <span className="text-gray-400 font-medium text-sm line-through">₹{originalPrice}</span>
            )}
          </div>

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

      <div className="p-3 pt-0 flex gap-2">
        <button
          onClick={handleAddToCart}
          className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-3 rounded-md text-sm font-medium transition-colors flex items-center justify-center gap-1"
        >
          <ShoppingCart size={12} />
          Add to Cart
        </button>

        <Link
          to={`/products/${product._id}`}
          className="px-3 py-2 border border-red-600 text-red-600 hover:bg-red-50 rounded-md text-sm font-medium transition-colors flex items-center justify-center"
        >
          <Eye size={12} />
        </Link>
      </div>

      <div className="px-3 pb-3">
        <p className="text-xs text-gray-500 flex items-center gap-1">
          <span className="w-2 h-2 bg-green-500 rounded-full"></span>
          Fast Festival Delivery
        </p>
      </div>
    </div>
  );
};

// Enhanced ProductsGrid component
const ProductsGrid = ({ products }) => {
  if (!products || products.length === 0) return null;

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
      {products.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  );
};

const Search = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const searchParams = new URLSearchParams(location.search);
  const initialQuery = searchParams.get('q') || '';

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalResults, setTotalResults] = useState(0);
  const [showFilters, setShowFilters] = useState(false);

  const [filters, setFilters] = useState({
    category: 'all',
    priceRange: null,
    sortBy: 'relevance'
  });

  const [suggestions] = useState([
    'rockets',
    'sparklers',
    'fountains',
    'morning crackers',
    'night crackers',
    'kids special',
    'gift boxes',
    'premium skyshots'
  ]);

  const performSearch = async (query = searchQuery, currentFilters = filters) => {
    if (!query.trim() && currentFilters.category === 'all') return;

    setLoading(true);
    try {
      const result = await searchProducts(query.trim(), currentFilters);
      setProducts(result.products);
      setTotalResults(result.total);
    } catch (error) {
      console.error('Search error:', error);
      setProducts([]);
      setTotalResults(0);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      performSearch();
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion);
    navigate(`/search?q=${encodeURIComponent(suggestion)}`);
    performSearch(suggestion);
  };

  const handleFilterChange = (filterType, value) => {
    const newFilters = { ...filters, [filterType]: value };
    setFilters(newFilters);
    performSearch(searchQuery, newFilters);
  };

  const clearFilters = () => {
    const defaultFilters = {
      category: 'all',
      priceRange: null,
      sortBy: 'relevance'
    };
    setFilters(defaultFilters);
    performSearch(searchQuery, defaultFilters);
  };

  useEffect(() => {
    if (initialQuery) {
      performSearch(initialQuery);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-700 hover:text-red-600 mb-4 transition-colors"
        >
          <ArrowLeft size={16} className="mr-1" />
          <span className="text-sm">Back</span>
        </button>
        {/* Compact Header */}
        <div className="mb-6">
          <h1 className="text-xl md:text-2xl font-bold text-gray-800 mb-4">
            {searchQuery ? `"${searchQuery}"` : 'Search Products'}
          </h1>

          {/* Compact Search Bar */}
          <form onSubmit={handleSearch} className="relative mb-4">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SearchIcon className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search crackers, categories..."
              className="w-full pl-10 pr-4 py-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all shadow-sm"
              autoFocus
            />
          </form>

          {/* Compact Suggestions */}
          {!searchQuery && !loading && products.length === 0 && (
            <div className="mb-4">
              <h3 className="text-sm font-semibold text-gray-800 mb-2">Popular Searches</h3>
              <div className="flex flex-wrap gap-2">
                {suggestions.map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="px-3 py-1.5 text-sm bg-white border border-gray-300 rounded-full hover:border-red-500 hover:text-red-600 transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Compact Results & Filters */}
          {(searchQuery || filters.category !== 'all') && (
            <div className="flex items-center justify-between mb-4">
              <div className="text-gray-600 text-sm">
                {loading ? (
                  <span>Searching...</span>
                ) : (
                  <span>{totalResults} results</span>
                )}
              </div>

              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2 px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg hover:border-red-500 transition-colors"
              >
                <Filter size={14} />
                <span>Filters</span>
                {showFilters ? <X size={14} /> : <SearchIcon size={14} />}
              </button>
            </div>
          )}

          {/* Compact Filters Panel */}
          {showFilters && (
            <div className="bg-white rounded-lg border border-gray-200 p-4 mb-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Category</label>
                  <select
                    value={filters.category}
                    onChange={(e) => handleFilterChange('category', e.target.value)}
                    className="w-full p-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                  >
                    <option value="all">All Categories</option>
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Price Range</label>
                  <select
                    value={filters.priceRange || ''}
                    onChange={(e) => handleFilterChange('priceRange', e.target.value || null)}
                    className="w-full p-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                  >
                    <option value="">Any</option>
                    {PRICE_RANGES.map((range, idx) => (
                      <option key={idx} value={range.label}>{range.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Sort By</label>
                  <select
                    value={filters.sortBy}
                    onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                    className="w-full p-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                  >
                    <option value="relevance">Relevance</option>
                    <option value="priceLowHigh">Price: Low to High</option>
                    <option value="priceHighLow">Price: High to Low</option>
                    <option value="newest">Newest</option>
                  </select>
                </div>
              </div>

              <div className="mt-4 flex justify-end">
                <button
                  onClick={clearFilters}
                  className="px-3 py-1.5 text-xs bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Results */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto mb-4"></div>
            <p className="text-gray-600 text-sm">Searching products...</p>
          </div>
        ) : products.length > 0 ? (
          <ProductsGrid products={products} />
        ) : (
          searchQuery && (
            <div className="text-center text-gray-500 py-12">
              <SearchIcon size={48} className="mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium mb-2">No products found</h3>
              <p className="text-sm">Try adjusting your search or filters</p>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default Search;