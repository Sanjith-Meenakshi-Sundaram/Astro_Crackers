import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, ArrowLeft, MapPin, Package, Calendar, Download, Receipt } from 'lucide-react';
import axios from 'axios';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable'; // ✅ Correct import

const API_URL = import.meta.env.VITE_API_URL;

const OrdersPage = () => {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showReceipt, setShowReceipt] = useState(false);

  const token = localStorage.getItem('token');

  // Price calculation helper function
  const calculatePrices = (price, discount = 80) => {
    const sellingPrice = price;
    const originalPrice = Math.round((sellingPrice * 100) / (100 - discount));
    const discountPercentage = Math.round(((originalPrice - sellingPrice) / originalPrice) * 100);

    return {
      sellingPrice,
      originalPrice,
      discountPercentage,
      savings: originalPrice - sellingPrice
    };
  };

  useEffect(() => {
    fetchLatestOrder();
  }, []);

  const fetchLatestOrder = async () => {
    try {
      if (!token) {
        setError('Please login to view your orders');
        setLoading(false);
        return;
      }

      const response = await axios.get(`${API_URL}/api/orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const orders = response.data.orders || response.data;

      // Check if orders exist and is not empty
      if (!orders || (Array.isArray(orders) && orders.length === 0)) {
        setOrder(null); // No orders found
        setLoading(false);
        return;
      }

      const latestOrder = Array.isArray(orders) ? orders[0] : orders;
      setOrder(latestOrder);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching orders:', err);

      // Check if it's a 404 or similar "no orders" response
      if (err.response?.status === 404 ||
        err.response?.data?.message?.toLowerCase().includes('no orders') ||
        err.response?.data?.message?.toLowerCase().includes('not found')) {
        setOrder(null); // No orders found, not an error
      } else {
        setError('Failed to load order details');
      }

      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const generatePDF = () => {
    if (!order) return;

    const doc = new jsPDF();

    // Calculate totals for pricing display
    let totalOriginalPrice = 0;
    let totalSellingPrice = 0;

    order.items.forEach((item) => {
      const prices = calculatePrices(item.price);
      totalOriginalPrice += prices.originalPrice * item.quantity;
      totalSellingPrice += prices.sellingPrice * item.quantity;
    });

    const totalSavings = totalOriginalPrice - totalSellingPrice;

    // 🔴 Brand Name
    doc.setFontSize(22);
    doc.setTextColor(220, 38, 38);
    doc.text('Astro Crackers', 105, 20, { align: 'center' });

    // Title
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text('ORDER RECEIPT', 105, 35, { align: 'center' });

    // Order details
    doc.setFontSize(10);
    doc.text(`Order Number: ${order.orderNumber}`, 20, 50);
    doc.text(`Date: ${formatDate(order.createdAt)}`, 20, 58);
    // doc.text(`Status: ${order.status.toUpperCase()}`, 20, 66);

    // Customer details
    doc.setFontSize(12);
    doc.text('Customer Details:', 20, 80);
    doc.setFontSize(10);
    doc.text(`${order.customerDetails.name}`, 20, 88);
    doc.text(`${order.customerDetails.phone}`, 20, 94);
    doc.text(`${order.customerDetails.email}`, 20, 100);

    // Address
    doc.setFontSize(12);
    doc.text('Delivery Address:', 20, 114);
    doc.setFontSize(10);
    doc.text(`${order.customerDetails.address.street}`, 20, 122);
    doc.text(
      `${order.customerDetails.address.city}, ${order.customerDetails.address.state}`,
      20,
      128
    );
    doc.text(`${order.customerDetails.address.pincode}`, 20, 134);

    // Items table
    const tableColumn = ['Item', 'Original', 'Selling', 'Qty', 'Subtotal'];
    const tableRows = order.items.map((item) => {
      const prices = calculatePrices(item.price);
      return [
        item.productName,
        `${prices.originalPrice}`,
        `${prices.sellingPrice}`,
        item.quantity.toString(),
        `${item.subtotal}`,
      ];
    });

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 150,
      theme: 'grid',
      styles: { fontSize: 10 },
      headStyles: { fillColor: [239, 68, 68] },
    });

    // Pricing summary
    const finalY = doc.lastAutoTable.finalY + 10;
    doc.setFontSize(10);
    doc.text(`Original Price: Rs. ${totalOriginalPrice}`, 20, finalY);
    doc.text(`Selling Price: Rs. ${totalSellingPrice}`, 20, finalY + 8);
    doc.setTextColor(34, 197, 94); // Green color
    doc.text(`You Saved: Rs. ${totalSavings}`, 20, finalY + 16);
    doc.setTextColor(0, 0, 0); // Reset to black
    doc.setFontSize(12);
    doc.text(`Total Amount: Rs. ${order.totalAmount}`, 20, finalY + 28);

    // Footer
    doc.setFontSize(8);
    doc.text(
      'Your celebration, our crackers. See you next time!',
      105,
      finalY + 40,
      null,
      null,
      'center'
    );
    doc.text(
      'For support, contact: crackers.astro@gmail.com',
      105,
      finalY + 48,
      null,
      null,
      'center'
    );
    doc.save(`Order-${order.orderNumber}.pdf`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-sm">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <Package size={48} className="text-gray-300 mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-gray-800 mb-2">
            {error || 'No orders found'}
          </h2>
          <Link
            to="/"
            className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  // Calculate totals for display
  let totalOriginalPrice = 0;
  let totalSellingPrice = 0;

  order.items.forEach((item) => {
    const prices = calculatePrices(item.price);
    totalOriginalPrice += prices.originalPrice * item.quantity;
    totalSellingPrice += prices.sellingPrice * item.quantity;
  });

  const totalSavings = totalOriginalPrice - totalSellingPrice;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-md mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center mb-6">
          <Link
            to="/"
            className="mr-3 p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} className="text-gray-600" />
          </Link>
          <h1 className="text-lg font-semibold text-gray-800">
            Order Confirmation
          </h1>
        </div>

        {/* Success Animation */}
        <div className="text-center mb-8">
          <CheckCircle size={80} className="text-green-500 animate-pulse mx-auto" />
          <h2 className="text-xl font-bold text-gray-800 mt-4 mb-2">
            Thank You For Your Order
          </h2>
          <p className="text-sm text-gray-600 mb-4">
            We've emailed you a confirmation and we'll notify you when your
            order has been dispatched.
          </p>
        </div>

        {/* Order Details Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 mb-4">
          <div className="p-4">
            {/* Delivery Section */}
            <div className="mb-6">
              <div className="flex items-center mb-3">
                <MapPin size={16} className="text-gray-600 mr-2" />
                <span className="font-medium text-gray-800 text-sm">
                  Delivery
                </span>
              </div>
              <div className="text-xs text-gray-600 leading-relaxed">
                <p className="font-medium text-gray-800">
                  {order.customerDetails.name}
                </p>
                <p>{order.customerDetails.address.street}</p>
                <p>
                  {order.customerDetails.address.city},{' '}
                  {order.customerDetails.address.state}
                </p>
                <p>{order.customerDetails.address.pincode}</p>
                <p className="mt-1">{order.customerDetails.email}</p>
                <p>{order.customerDetails.phone}</p>
              </div>
            </div>

            {/* Purchase Number */}
            <div className="mb-6">
              <div className="flex items-center mb-2">
                <Package size={16} className="text-gray-600 mr-2" />
                <span className="font-medium text-gray-800 text-sm">
                  Purchase Number
                </span>
              </div>
              <p className="text-xs text-gray-600">{order.orderNumber}</p>
            </div>

            {/* Date */}
            <div className="mb-6">
              <div className="flex items-center mb-2">
                <Calendar size={16} className="text-gray-600 mr-2" />
                <span className="font-medium text-gray-800 text-sm">
                  Order Date
                </span>
              </div>
              <p className="text-xs text-gray-600">
                {formatDate(order.createdAt)}
              </p>
            </div>

            {/* Payment Summary */}
            <div className="border-t border-gray-100 pt-4 mb-4">
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-600">Original Price</span>
                  <span className="text-gray-500 line-through">₹{totalOriginalPrice}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Selling Price</span>
                  <span className="text-green-600 font-medium">₹{totalSellingPrice}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-green-600">You Saved</span>
                  <span className="text-green-600 font-medium">₹{totalSavings}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Delivery</span>
                  <span className="text-gray-800">₹0.00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax</span>
                  <span className="text-gray-800">₹0.00</span>
                </div>
                <div className="flex justify-between font-semibold border-t border-gray-100 pt-2">
                  <span className="text-gray-800">Total</span>
                  <span className="text-green-600">₹{order.totalAmount}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Items Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 mb-6">
          <div className="p-4">
            <h3 className="font-medium text-gray-800 text-sm mb-3">Items</h3>
            <div className="space-y-3">
              {order.items.map((item, index) => {
                const prices = calculatePrices(item.price);
                return (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex-shrink-0 flex items-center justify-center">
                      <Package size={16} className="text-gray-400" />
                    </div>
                    <div className="flex-grow min-w-0">
                      <p className="text-sm font-medium text-gray-800 line-clamp-2">
                        {item.productName}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-green-600 font-medium">₹{prices.sellingPrice}</span>
                        <span className="text-xs text-gray-500 line-through">₹{prices.originalPrice}</span>
                        <span className="text-xs bg-green-100 text-green-800 px-1 rounded">
                          {prices.discountPercentage}% OFF
                        </span>
                      </div>
                      <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-green-600">
                        ₹{item.subtotal}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={() => setShowReceipt(!showReceipt)}
            className="w-full bg-gray-800 text-white py-3 rounded-lg text-sm font-medium hover:bg-gray-900 transition-colors flex items-center justify-center gap-2"
          >
            <Receipt size={16} />
            {showReceipt ? 'Hide Receipt' : 'View Receipt'}
          </button>

          <button
            onClick={generatePDF}
            className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
          >
            <Download size={16} />
            Download Receipt
          </button>
        </div>

        {/* Receipt Details Modal */}
        {showReceipt && (
          <div className="fixed inset-0 bg-black flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg w-full max-w-md max-h-[80vh] overflow-y-auto shadow-xl">
              <div className="sticky top-0 bg-white border-b border-gray-100 p-4 flex items-center justify-between">
                <h3 className="font-semibold text-gray-800">Receipt Details</h3>
                <button
                  onClick={() => setShowReceipt(false)}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  ✕
                </button>
              </div>

              <div className="p-4">
                <div className="text-center mb-2">
                  <h2 className="text-2xl font-extrabold text-red-600 flex items-center justify-center gap-2">
                    🧨 Astro Crackers
                  </h2>
                </div>

                <div className="text-center mb-4">
                  <h4 className="font-bold text-lg">ORDER RECEIPT</h4>
                  <p className="text-xs text-gray-600">{order.orderNumber}</p>
                </div>

                <div className="space-y-4 text-xs">
                  <div>
                    <p className="font-semibold mb-1">Customer Details:</p>
                    <p>{order.customerDetails.name}</p>
                    <p>{order.customerDetails.phone}</p>
                    <p>{order.customerDetails.email}</p>
                  </div>

                  <div>
                    <p className="font-semibold mb-1">Delivery Address:</p>
                    <p>{order.customerDetails.address.street}</p>
                    <p>
                      {order.customerDetails.address.city},{' '}
                      {order.customerDetails.address.state}
                    </p>
                    <p>{order.customerDetails.address.pincode}</p>
                  </div>

                  <div>
                    <p className="font-semibold mb-2">Items:</p>
                    {order.items.map((item, index) => {
                      const prices = calculatePrices(item.price);
                      return (
                        <div
                          key={index}
                          className="flex justify-between py-1 border-b border-gray-100"
                        >
                          <div>
                            <p className="font-medium">{item.productName}</p>
                            <div className="flex items-center gap-2">
                              <span className="text-green-600 font-medium">₹{prices.sellingPrice}</span>
                              <span className="text-gray-500 line-through">₹{prices.originalPrice}</span>
                              <span className="text-gray-600">× {item.quantity}</span>
                            </div>
                            <p className="text-green-600 text-xs">
                              Saved: ₹{prices.savings * item.quantity}
                            </p>
                          </div>
                          <p className="font-semibold text-green-600">₹{item.subtotal}</p>
                        </div>
                      );
                    })}
                  </div>

                  <div className="border-t border-gray-200 pt-2 space-y-1">
                    <div className="flex justify-between text-gray-600">
                      <span>Original Price:</span>
                      <span className="line-through">₹{totalOriginalPrice}</span>
                    </div>
                    <div className="flex justify-between text-green-600">
                      <span>You Saved:</span>
                      <span className="font-medium">₹{totalSavings}</span>
                    </div>
                    <div className="flex justify-between font-bold text-green-600 border-t pt-1">
                      <span>Total Amount:</span>
                      <span>₹{order.totalAmount}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Continue Shopping */}
        <div className="text-center mt-4 pb-10">
          <Link
            to="/"
            className="text-blue-600 text-sm font-medium hover:text-blue-700 transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrdersPage;