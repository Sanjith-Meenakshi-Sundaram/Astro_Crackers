import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft, Heart, Phone, MapPin } from 'lucide-react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingItemId, setUpdatingItemId] = useState(null);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [placing, setPlacing] = useState(false);
  const [address, setAddress] = useState({
    street: '',
    city: '',
    state: '',
    pincode: ''
  });
  const [phone, setPhone] = useState('');
  const [addressErrors, setAddressErrors] = useState({});

  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  // Fetch cart items
  useEffect(() => {
    fetchCartItems();
  }, []);

  const fetchCartItems = async () => {
    try {
      if (!token) {
        setError('Please login to view your cart');
        setLoading(false);
        return;
      }

      const response = await axios.get(`${API_URL}/api/cart`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const items = response.data.items || [];

      // Filter out items with null/undefined products and clean up invalid items
      const validItems = items.filter(item => item && item.product && item.product._id);
      const invalidItems = items.filter(item => !item || !item.product || !item.product._id);

      // If there are invalid items, remove them from backend
      if (invalidItems.length > 0) {
        console.log('Found invalid cart items, cleaning up...');
        await cleanupInvalidItems(invalidItems);
      }

      setCartItems(validItems);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching cart:', err);
      setError('Failed to load cart items');
      setLoading(false);
    }
  };

  // Clean up invalid cart items from backend
  const cleanupInvalidItems = async (invalidItems) => {
    try {
      for (const item of invalidItems) {
        if (item && item._id) {
          await axios.delete(`${API_URL}/api/cart/${item._id}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
        }
      }
    } catch (err) {
      console.error('Error cleaning up invalid items:', err);
    }
  };

  // Update quantity
  const updateQuantity = async (productId, newQuantity) => {
    if (newQuantity <= 0) return;

    setUpdatingItemId(productId);
    try {
      await axios.put(
        `${API_URL}/api/cart/${productId}`,
        { quantity: newQuantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setCartItems(items =>
        items.map(item =>
          item.product && item.product._id === productId
            ? { ...item, quantity: newQuantity }
            : item
        ).filter(item => item.product && item.product._id) // Additional safety filter
      );
    } catch (err) {
      console.error('Error updating quantity:', err);
      alert('Failed to update quantity');
    } finally {
      setUpdatingItemId(null);
    }
  };

  // Remove item from cart
  const removeFromCart = async (productId) => {
    try {
      await axios.delete(`${API_URL}/api/cart/${productId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setCartItems(items => items.filter(item =>
        item.product && item.product._id !== productId
      ));
    } catch (err) {
      console.error('Error removing item:', err);
      alert('Failed to remove item from cart');
    }
  };

  // Add to wishlist
  const addToWishlist = async (productId) => {
    try {
      await axios.post(
        `${API_URL}/api/wishlist`,
        { productId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Added to wishlist ✅');
    } catch (err) {
      console.error('Error adding to wishlist:', err);
      alert('Failed to add to wishlist');
    }
  };

  // Validate address form
  const validateAddress = () => {
    const errors = {};
    if (!address.street.trim()) errors.street = 'Street address is required';
    if (!address.city.trim()) errors.city = 'City is required';
    if (!address.state.trim()) errors.state = 'State is required';
    if (!address.pincode.trim()) errors.pincode = 'Pincode is required';
    if (!phone.trim()) errors.phone = 'Phone number is required';
    if (phone.trim() && phone.trim().length < 10) errors.phone = 'Phone number must be at least 10 digits';

    setAddressErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle address form submission
  const handleAddressSubmit = () => {
    if (validateAddress()) {
      setShowAddressForm(false);
      setShowConfirmation(true);
    }
  };

  // Place order
  const placeOrder = async () => {
    setPlacing(true);
    try {
      // Filter valid items again before placing order
      const validCartItems = cartItems.filter(item => item.product && item.product._id && item.product.name && item.product.price);

      const orderData = {
        cartItems: validCartItems.map(item => ({
          productId: item.product._id,
          name: item.product.name,
          price: item.product.price,
          quantity: item.quantity
        })),
        address: {
          street: address.street,
          city: address.city,
          state: address.state,
          pincode: address.pincode
        },
        phone: phone
      };

      await axios.post(`${API_URL}/api/orders`, orderData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Try to clear cart after successful order, but don't fail if it errors
      try {
        await Promise.all(
          validCartItems.map(item =>
            axios.delete(`${API_URL}/api/cart/${item.product._id}`, {
              headers: { Authorization: `Bearer ${token}` }
            }).catch(err => {
              console.log('Cart item cleanup failed for:', item.product._id, err.response?.status);
              // Don't throw, just log the error
            })
          )
        );
      } catch (cartClearError) {
        console.log('Some cart items could not be cleared, but order was successful');
      }

      // Show success message and navigate
      alert('Order placed successfully! ✅');
      navigate('/orders');
    } catch (err) {
      console.error('Error placing order:', err);
      if (err.response?.status === 500 && err.message.includes('Request failed')) {
        alert('Order might have been placed successfully. Please check your orders page.');
      } else {
        alert('Failed to place order. Please try again.');
      }
    } finally {
      setPlacing(false);
      setShowConfirmation(false);
    }
  };

  // Filter valid items for calculations
  const validCartItems = cartItems.filter(item =>
    item && item.product && item.product._id && typeof item.product.price === 'number' && item.quantity
  );

  // Calculate totals with null checks
  const subtotal = validCartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const shipping = subtotal > 500 ? 0 : 50;
  const total = subtotal + shipping;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-sm">Loading cart...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <ShoppingBag size={48} className="text-gray-300 mx-auto mb-4" />
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

  if (validCartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 py-4">
          {/* Header */}
          <div className="flex items-center mb-6">
            <Link to="/" className="mr-3 p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <ArrowLeft size={20} className="text-gray-600" />
            </Link>
            <h1 className="text-xl font-semibold text-gray-800">My Cart</h1>
          </div>

          {/* Empty State */}
          <div className="bg-white rounded-lg p-8 text-center shadow-sm">
            <ShoppingBag size={64} className="text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Your cart is empty</h2>
            <p className="text-gray-600 mb-6 text-sm">Add items to get started</p>
            <Link
              to="/"
              className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 py-4">
          {/* Header */}
          <div className="flex items-center mb-6">
            <Link to="/" className="mr-3 p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <ArrowLeft size={20} className="text-gray-600" />
            </Link>
            <h1 className="text-xl font-semibold text-gray-800">
              My Cart ({validCartItems.length})
            </h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-3">
              {validCartItems.map((item) => (
                <div key={item.product._id} className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
                  <div className="flex gap-4">
                    {/* Product Image */}
                    <div className="flex-shrink-0">
                      <Link to={`/products/${item.product._id}`}>
                        <img
                          src={item.product.images?.[0] || "https://placehold.co/80x80/e5e7eb/6b7280?text=No+Image"}
                          alt={item.product.name || "Product"}
                          className="w-16 h-16 object-cover rounded-lg hover:opacity-75 transition-opacity"
                        />
                      </Link>
                    </div>

                    {/* Product Details */}
                    <div className="flex-grow min-w-0">
                      <div className="flex justify-between items-start mb-2">
                        <Link
                          to={`/products/${item.product._id}`}
                          className="text-sm font-medium text-gray-800 hover:text-blue-600 transition-colors line-clamp-2 pr-2"
                        >
                          {item.product.name || "Unknown Product"}
                        </Link>
                        <button
                          onClick={() => removeFromCart(item.product._id)}
                          className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                          title="Remove"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>

                      <p className="text-lg font-semibold text-gray-900 mb-3">₹{item.product.price || 0}</p>

                      {/* Actions */}
                      <div className="flex items-center justify-between">
                        {/* Quantity Controls */}
                        <div className="flex items-center border border-gray-200 rounded">
                          <button
                            onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                            disabled={item.quantity <= 1 || updatingItemId === item.product._id}
                            className="p-1 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="px-3 py-1 text-sm font-medium min-w-[40px] text-center">
                            {updatingItemId === item.product._id ? '...' : item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                            disabled={updatingItemId === item.product._id}
                            className="p-1 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          >
                            <Plus size={14} />
                          </button>
                        </div>

                        {/* Save for Later */}
                        <button
                          onClick={() => {
                            addToWishlist(item.product._id);
                            removeFromCart(item.product._id);
                          }}
                          className="flex items-center gap-1 px-3 py-1 text-xs text-gray-600 hover:text-red-600 transition-colors"
                        >
                          <Heart size={12} />
                          Save for later
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 sticky top-4">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Price Details</h2>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Price ({validCartItems.length} items)</span>
                    <span>₹{subtotal}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Delivery Charges</span>
                    <span>
                      {shipping === 0 ? (
                        <span className="text-green-600">FREE</span>
                      ) : (
                        `₹${shipping}`
                      )}
                    </span>
                  </div>
                  {subtotal < 500 && (
                    <p className="text-xs text-gray-500">
                      ₹{500 - subtotal} more for free delivery
                    </p>
                  )}
                  <hr className="my-2" />
                  <div className="flex justify-between font-semibold">
                    <span>Total Amount</span>
                    <span>₹{total}</span>
                  </div>
                </div>

                <button
                  onClick={() => setShowAddressForm(true)}
                  className="w-full bg-orange-500 text-white py-2.5 rounded text-sm font-medium hover:bg-orange-600 transition-colors mb-3"
                >
                  Send Order Request
                </button>

                <Link
                  to="/"
                  className="block w-full text-center py-2.5 border border-gray-300 text-gray-700 rounded text-sm font-medium hover:bg-gray-50 transition-colors"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Address Form Modal */}
      {showAddressForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center mb-4">
              <MapPin size={24} className="text-blue-600 mr-2" />
              <h3 className="text-lg font-semibold text-gray-800">Delivery Address</h3>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
                <input
                  type="text"
                  value={address.street}
                  onChange={(e) => setAddress({ ...address, street: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${addressErrors.street ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="House no, Building, Street"
                />
                {addressErrors.street && <p className="text-red-500 text-xs mt-1">{addressErrors.street}</p>}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                  <input
                    type="text"
                    value={address.city}
                    onChange={(e) => setAddress({ ...address, city: e.target.value })}
                    className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${addressErrors.city ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="City"
                  />
                  {addressErrors.city && <p className="text-red-500 text-xs mt-1">{addressErrors.city}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                  <input
                    type="text"
                    value={address.state}
                    onChange={(e) => setAddress({ ...address, state: e.target.value })}
                    className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${addressErrors.state ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="State"
                  />
                  {addressErrors.state && <p className="text-red-500 text-xs mt-1">{addressErrors.state}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Pincode</label>
                <input
                  type="text"
                  value={address.pincode}
                  onChange={(e) => setAddress({ ...address, pincode: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${addressErrors.pincode ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="Pincode"
                />
                {addressErrors.pincode && <p className="text-red-500 text-xs mt-1">{addressErrors.pincode}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${addressErrors.phone ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="10-digit mobile number"
                />
                {addressErrors.phone && <p className="text-red-500 text-xs mt-1">{addressErrors.phone}</p>}
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowAddressForm(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded text-sm font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddressSubmit}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="text-center mb-6">
              <Phone size={48} className="text-blue-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Confirm Your Order</h3>
              <p className="text-sm text-gray-600 mb-4">
                Our team will call you to confirm your order details and delivery.
              </p>

              {/* Address Summary */}
              <div className="bg-gray-50 rounded-lg p-3 text-left text-xs">
                <p className="font-medium text-gray-800 mb-1">Delivery Address:</p>
                <p className="text-gray-600">
                  {address.street}<br />
                  {address.city}, {address.state} - {address.pincode}<br />
                  Phone: {phone}
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirmation(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded text-sm font-medium hover:bg-gray-50 transition-colors"
                disabled={placing}
              >
                Back
              </button>
              <button
                onClick={placeOrder}
                disabled={placing}
                className="flex-1 px-4 py-2 bg-orange-500 text-white rounded text-sm font-medium hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {placing ? 'Placing...' : 'Confirm Order'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CartPage;