import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Trash2, ArrowLeft, ShoppingBag } from 'lucide-react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const WishlistPage = () => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [addingToCartId, setAddingToCartId] = useState(null);

  const token = localStorage.getItem('token');

  // Fetch wishlist items
  useEffect(() => {
    fetchWishlistItems();
  }, []);

  const fetchWishlistItems = async () => {
    try {
      if (!token) {
        setError('Please login to view your wishlist');
        setLoading(false);
        return;
      }

      const response = await axios.get(`${API_URL}/api/wishlist`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setWishlistItems(response.data.items || []);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching wishlist:', err);
      setError('Failed to load wishlist items');
      setLoading(false);
    }
  };

  // Remove from wishlist
  const removeFromWishlist = async (productId) => {
    try {
      await axios.delete(`${API_URL}/api/wishlist/${productId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setWishlistItems(items => items.filter(item => item.product._id !== productId));
    } catch (err) {
      console.error('Error removing from wishlist:', err);
      alert('Failed to remove item from wishlist');
    }
  };

  // Add to cart
  const addToCart = async (productId) => {
    setAddingToCartId(productId);
    try {
      await axios.post(
        `${API_URL}/api/cart`,
        { productId, quantity: 1 },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Added to cart ✅');
    } catch (err) {
      console.error('Error adding to cart:', err);
      alert('Failed to add to cart');
    } finally {
      setAddingToCartId(null);
    }
  };

  // Move to cart (add to cart and remove from wishlist)
  const moveToCart = async (productId) => {
    setAddingToCartId(productId);
    try {
      await axios.post(
        `${API_URL}/api/cart`,
        { productId, quantity: 1 },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      await removeFromWishlist(productId);
      alert('Moved to cart ✅');
    } catch (err) {
      console.error('Error moving to cart:', err);
      alert('Failed to move to cart');
    } finally {
      setAddingToCartId(null);
    }
  };

  // Move all to cart
  const moveAllToCart = async () => {
    for (const item of wishlistItems) {
      await moveToCart(item.product._id);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-sm">Loading wishlist...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <Heart size={48} className="text-gray-300 mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-gray-800 mb-2">{error}</h2>
          <Link
            to="/login"
            className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
          >
            Login Now
          </Link>
        </div>
      </div>
    );
  }

  if (wishlistItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 py-4">
          {/* Header */}
          <div className="flex items-center mb-6">
            <Link to="/" className="mr-3 p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <ArrowLeft size={20} className="text-gray-600" />
            </Link>
            <h1 className="text-xl font-semibold text-gray-800">My Wishlist</h1>
          </div>

          {/* Empty State */}
          <div className="bg-white rounded-lg p-8 text-center shadow-sm">
            <Heart size={64} className="text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Your wishlist is empty</h2>
            <p className="text-gray-600 mb-6 text-sm">Save items you like to buy them later</p>
            <Link
              to="/"
              className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
            >
              Start Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Link to="/" className="mr-3 p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <ArrowLeft size={20} className="text-gray-600" />
            </Link>
            <h1 className="text-xl font-semibold text-gray-800">
              My Wishlist ({wishlistItems.length})
            </h1>
          </div>
          
          {/* Move All to Cart Button */}
          {wishlistItems.length > 0 && (
            <button
              onClick={moveAllToCart}
              className="hidden sm:flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded text-sm font-medium hover:bg-orange-600 transition-colors"
            >
              <ShoppingCart size={16} />
              Move All to Cart
            </button>
          )}
        </div>

        {/* Wishlist Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {wishlistItems.map((item) => (
            <div key={item.product._id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-100 group">
              {/* Product Image */}
              <div className="relative">
                <Link to={`/products/${item.product._id}`}>
                  <img
                    src={item.product.images?.[0] || "https://placehold.co/200x200/e5e7eb/6b7280?text=No+Image"}
                    alt={item.product.name}
                    className="w-full h-40 object-cover group-hover:opacity-75 transition-opacity rounded-t-lg"
                  />
                </Link>
                
                {/* Remove from Wishlist */}
                <button
                  onClick={() => removeFromWishlist(item.product._id)}
                  className="absolute top-2 right-2 p-1.5 bg-white rounded-full shadow-sm hover:bg-gray-100 transition-colors"
                  title="Remove from wishlist"
                >
                  <Heart size={14} className="text-red-500 fill-red-500" />
                </button>

                {/* Bestseller Badge */}
                {item.product.isBestSeller && (
                  <span className="absolute top-2 left-2 bg-orange-500 text-white text-xs px-2 py-0.5 rounded font-medium">
                    Bestseller
                  </span>
                )}
              </div>

              {/* Product Details */}
              <div className="p-3">
                <Link 
                  to={`/products/${item.product._id}`}
                  className="block text-gray-800 font-medium text-sm hover:text-blue-600 transition-colors line-clamp-2 mb-2 min-h-[40px]"
                >
                  {item.product.name}
                </Link>
                
                <p className="text-gray-900 font-semibold text-base mb-3">₹{item.product.price}</p>

                {/* Action Buttons */}
                <div className="space-y-2">
                  <button
                    onClick={() => moveToCart(item.product._id)}
                    disabled={addingToCartId === item.product._id}
                    className="w-full bg-orange-500 text-white py-2 rounded text-sm font-medium hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1"
                  >
                    {addingToCartId === item.product._id ? (
                      <>
                        <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span className="text-xs">Moving...</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag size={14} />
                        <span>Move to Cart</span>
                      </>
                    )}
                  </button>

                  <div className="flex gap-1">
                    <button
                      onClick={() => addToCart(item.product._id)}
                      disabled={addingToCartId === item.product._id}
                      className="flex-1 border border-gray-300 text-gray-700 py-1.5 rounded text-xs font-medium hover:border-orange-500 hover:text-orange-500 transition-colors disabled:opacity-50"
                    >
                      Add to Cart
                    </button>
                    
                    <button
                      onClick={() => removeFromWishlist(item.product._id)}
                      className="p-1.5 border border-gray-300 text-gray-600 rounded hover:border-red-500 hover:text-red-500 transition-colors"
                      title="Remove"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile Move All Button */}
        {wishlistItems.length > 0 && (
          <div className="sm:hidden fixed bottom-4 left-4 right-4">
            <button
              onClick={moveAllToCart}
              className="w-full bg-orange-500 text-white py-3 rounded-lg font-medium hover:bg-orange-600 transition-colors flex items-center justify-center gap-2 shadow-lg"
            >
              <ShoppingCart size={18} />
              Move All to Cart
            </button>
          </div>
        )}

        {/* Continue Shopping */}
        <div className="mt-8 text-center pb-20 sm:pb-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors text-sm font-medium"
          >
            <ArrowLeft size={16} />
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default WishlistPage;