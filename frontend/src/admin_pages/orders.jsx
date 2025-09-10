import React, { useState, useEffect } from 'react';
import { Calendar, User, MapPin, Phone, Mail, Package, Clock, RefreshCw } from 'lucide-react';

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem('adminToken');
      console.log('Token from localStorage:', token);
      console.log('Token length:', token ? token.length : 'null');

      if (!token) {
        throw new Error('No token found - please login again');
      }

      console.log('Making request to:', 'https://astro-crackers.onrender.com/api/orders/admin');
      console.log('Authorization header:', `Bearer ${token}`);

      const response = await fetch('https://astro-crackers.onrender.com/api/orders/admin', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);

      if (!response.ok) {
        const errorText = await response.text();
        console.log('Error response body:', errorText);
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      console.log('Success response:', data);
      setOrders(data.orders || []);
    } catch (err) {
      console.error('Fetch error details:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'confirmed':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'delivered':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'cancelled':
        return 'bg-gray-100 text-gray-700 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const filteredOrders = orders.filter(order => {
    if (filter === 'all') return true;
    return order.status === filter;
  });

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const response = await fetch(`https://astro-crackers.onrender.com/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        setOrders(orders.map(order =>
          order._id === orderId ? { ...order, status: newStatus } : order
        ));
      }
    } catch (err) {
      console.error('Failed to update order status:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center space-x-2 text-red-600">
          <RefreshCw className="w-5 h-5 animate-spin" />
          <span className="text-lg font-medium">Loading orders...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md border-l-4 border-red-500">
          <h2 className="text-xl font-semibold text-red-700 mb-2">Error Loading Orders</h2>
          <p className="text-gray-600">{error}</p>
          <button
            onClick={fetchOrders}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Order Management</h1>
            <p className="text-gray-600 mt-1">Manage and track customer orders</p>
          </div>
          <button
            onClick={fetchOrders}
            className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Refresh</span>
          </button>
        </div>

        {/* Filters */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <span className="block text-sm font-medium text-gray-700 mb-3 sm:inline sm:mb-0 sm:mr-4">Filter by status:</span>
          <div className="grid grid-cols-2 gap-2 sm:flex sm:items-center sm:space-x-4 sm:gap-0">
            {['all', 'pending', 'confirmed', 'delivered', 'cancelled'].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-3 py-2 sm:py-1 rounded-full text-xs font-medium capitalize transition-colors ${filter === status
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-6">
        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
            <Package className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-gray-900 mb-1">No orders found</h3>
            <p className="text-gray-600">No orders match the current filter criteria.</p>
          </div>
        ) : (
          filteredOrders.map((order) => (
            <div key={order._id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              {/* Order Header */}
              <div className="bg-red-50 border-b border-red-100 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        Order #{order.orderNumber}
                      </h3>
                      <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600">
                        <span className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>{formatDate(order.createdAt)}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Package className="w-4 h-4" />
                          <span>{order.items.length} item{order.items.length !== 1 ? 's' : ''}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border capitalize ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                    <select
                      value={order.status}
                      onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                      className="text-sm border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="p-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Customer Details */}
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center space-x-2">
                      <User className="w-4 h-4 text-red-600" />
                      <span>Customer Information</span>
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-start space-x-2">
                        <User className="w-4 h-4 text-gray-400 mt-0.5" />
                        <div>
                          <span className="font-medium">{order.customerDetails.name}</span>
                        </div>
                      </div>
                      <div className="flex items-start space-x-2">
                        <Mail className="w-4 h-4 text-gray-400 mt-0.5" />
                        <span className="text-gray-600">{order.customerDetails.email}</span>
                      </div>
                      <div className="flex items-start space-x-2">
                        <Phone className="w-4 h-4 text-gray-400 mt-0.5" />
                        <span className="text-gray-600">{order.customerDetails.phone}</span>
                      </div>
                      <div className="flex items-start space-x-2">
                        <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                        <div className="text-gray-600">
                          <div>{order.customerDetails.address.street}</div>
                          <div>
                            {order.customerDetails.address.city}, {order.customerDetails.address.state}
                          </div>
                          <div>{order.customerDetails.address.pincode}</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Order Summary */}
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center space-x-2">
                      <Package className="w-4 h-4 text-red-600" />
                      <span>Order Summary</span>
                    </h4>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="flex justify-between items-center text-lg font-semibold">
                        <span>Total Amount:</span>
                        <span className="text-red-600">₹{order.totalAmount.toFixed(2)}</span>
                      </div>
                      <div className="text-xs text-gray-600 mt-1">
                        Order ID: {order._id}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Order Items Table */}
                <div className="mt-6">
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">Order Items</h4>
                  <div className="overflow-x-auto">
                    <table className="w-full border border-gray-200 rounded-lg overflow-hidden">
                      <thead className="bg-red-600 text-white">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium uppercase">Product</th>
                          <th className="px-4 py-3 text-center text-xs font-medium uppercase">Quantity</th>
                          <th className="px-4 py-3 text-right text-xs font-medium uppercase">Price</th>
                          <th className="px-4 py-3 text-right text-xs font-medium uppercase">Subtotal</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {order.items.map((item, index) => (
                          <tr key={item._id} className={index % 2 === 0 ? 'bg-white' : 'bg-red-50'}>
                            <td className="px-4 py-3 text-sm font-medium text-gray-900">
                              {item.productName}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-600 text-center">
                              {item.quantity}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-600 text-right">
                              ₹{item.price.toFixed(2)}
                            </td>
                            <td className="px-4 py-3 text-sm font-medium text-gray-900 text-right">
                              ₹{item.subtotal.toFixed(2)}
                            </td>
                          </tr>
                        ))}
                        <tr className="bg-red-600 text-white">
                          <td colSpan="3" className="px-4 py-3 text-sm font-semibold text-right">
                            Total Amount:
                          </td>
                          <td className="px-4 py-3 text-sm font-bold text-right">
                            ₹{order.totalAmount.toFixed(2)}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Statistics Footer */}
      <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-red-600">{orders.length}</div>
            <div className="text-sm text-gray-600">Total Orders</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-orange-600">
              {orders.filter(o => o.status === 'pending').length}
            </div>
            <div className="text-sm text-gray-600">Pending</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-blue-600">
              {orders.filter(o => o.status === 'confirmed').length}
            </div>
            <div className="text-sm text-gray-600">Confirmed</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-600">
              {orders.filter(o => o.status === 'delivered').length}
            </div>
            <div className="text-sm text-gray-600">Delivered</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOrdersPage;