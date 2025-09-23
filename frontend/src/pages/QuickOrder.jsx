import React, { useState, useEffect } from 'react';
import { ShoppingCart, Plus, Minus, Mail, Phone, MapPin, User, Download } from 'lucide-react';

const QuickOrder = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState({});
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState({});
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [customerDetails, setCustomerDetails] = useState({
    name: '',
    email: '',
    phone: '',
    address: {
      street: '',
      city: '',
      state: '',
      pincode: ''
    }
  });
  const [submitting, setSubmitting] = useState(false);
  const [generatingPDF, setGeneratingPDF] = useState(false);

  const categoryNames = [
    'morning crackers',
    'night crackers', 
    'kids special',
    'premium skyshots',
    'gift boxes'
  ];

  const discount = 80; // 80% discount

  // Calculate original price from selling price
  const calculateOriginalPrice = (sellingPrice) => {
    return Math.round((sellingPrice * 100) / (100 - discount));
  };

  // Fetch products for all categories
  useEffect(() => {
    const fetchAllProducts = async () => {
      setLoading(true);
      try {
        const productsByCategory = {};
        
        for (const category of categoryNames) {
          const response = await fetch(`https://astro-crackers.onrender.com/api/products/category/${encodeURIComponent(category)}`);
          if (response.ok) {
            const data = await response.json();
            productsByCategory[category] = data.products || [];
          } else {
            productsByCategory[category] = [];
          }
        }
        
        setProducts(productsByCategory);
        setCategories(categoryNames);
      } catch (error) {
        console.error('Error fetching products:', error);
        // Set empty arrays for all categories on error
        const emptyProducts = {};
        categoryNames.forEach(cat => {
          emptyProducts[cat] = [];
        });
        setProducts(emptyProducts);
      } finally {
        setLoading(false);
      }
    };

    fetchAllProducts();
  }, []);

  // Generate and download PDF price list
  const downloadPriceList = async () => {
    setGeneratingPDF(true);
    try {
      // Create a new window for PDF content
      const printWindow = window.open('', '_blank');
      
      // Get all categories with their products (maintain order and avoid duplication)
      const categoriesWithProducts = [];
      categories.forEach(category => {
        if (products[category] && products[category].length > 0) {
          categoriesWithProducts.push({
            categoryName: category,
            products: products[category].map(product => ({
              ...product,
              originalPrice: calculateOriginalPrice(product.price)
            }))
          });
        }
      });

      // Split categories into 3 pages
      const totalCategories = categoriesWithProducts.length;
      const categoriesPerPage = Math.ceil(totalCategories / 3);
      
      const page1Categories = categoriesWithProducts.slice(0, categoriesPerPage);
      const page2Categories = categoriesWithProducts.slice(categoriesPerPage, categoriesPerPage * 2);
      const page3Categories = categoriesWithProducts.slice(categoriesPerPage * 2);

      // Create PDF-styled HTML content
      const pdfContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>ASTRO CRACKERS - Price List</title>
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            
            body {
              font-family: Arial, sans-serif;
              background: white;
              color: #333;
            }
            
            .page {
              width: 210mm;
              min-height: 297mm;
              margin: 0 auto;
              padding: 15mm;
              background: white;
              page-break-after: always;
            }
            
            .page:last-child {
              page-break-after: auto;
            }
            
            .header {
              background: linear-gradient(to right, #dc2626, #b91c1c);
              color: white;
              padding: 15px;
              border-radius: 8px;
              margin-bottom: 15px;
              text-align: center;
            }
            
            .header h1 {
              font-size: 24px;
              font-weight: bold;
              margin-bottom: 5px;
            }
            
            .header .subtitle {
              font-size: 12px;
              opacity: 0.9;
              margin-bottom: 8px;
            }
            
            .offer-badge {
              background: #fbbf24;
              color: #b91c1c;
              padding: 5px 12px;
              border-radius: 15px;
              font-weight: bold;
              display: inline-block;
              font-size: 12px;
              margin-top: 5px;
            }
            
            .contact-info {
              display: flex;
              justify-content: space-around;
              margin-top: 10px;
              font-size: 10px;
            }
            
            .contact-item {
              display: flex;
              align-items: center;
              gap: 3px;
            }
            
            .category-section {
              margin-bottom: 20px;
            }
            
            .category-title {
              background: #dc2626;
              color: white;
              padding: 8px 15px;
              border-radius: 6px 6px 0 0;
              font-size: 14px;
              font-weight: bold;
              text-transform: uppercase;
              margin-bottom: 0;
            }
            
            .products-table {
              width: 100%;
              border-collapse: collapse;
              background: white;
              border: 2px solid #fecaca;
              border-radius: 0 0 6px 6px;
              overflow: hidden;
            }
            
            .products-table th {
              background: #dc2626;
              color: white;
              padding: 8px;
              text-align: left;
              font-weight: bold;
              font-size: 12px;
            }
            
            .products-table th:nth-child(1) { width: 50px; }
            .products-table th:nth-child(2) { width: auto; }
            .products-table th:nth-child(3) { width: 100px; text-align: center; }
            
            .products-table td {
              padding: 8px;
              border-bottom: 1px solid #fee2e2;
              font-size: 11px;
            }
            
            .products-table tr:nth-child(even) {
              background: #f9fafb;
            }
            
            .product-image {
              width: 35px;
              height: 35px;
              background: #e5e7eb;
              border-radius: 4px;
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 8px;
              color: #6b7280;
            }
            
            .product-image img {
              width: 100%;
              height: 100%;
              object-fit: cover;
              border-radius: 4px;
            }
            
            .product-name {
              font-weight: bold;
              color: #1f2937;
              margin-bottom: 2px;
              font-size: 12px;
            }
            
            .best-seller-badge {
              background: #fbbf24;
              color: #b45309;
              font-size: 8px;
              padding: 1px 4px;
              border-radius: 3px;
              margin-top: 2px;
              display: inline-block;
            }
            
            .price-container {
              text-align: center;
            }
            
            .original-price {
              color: #6b7280;
              text-decoration: line-through;
              font-size: 10px;
              display: block;
            }
            
            .current-price {
              color: #16a34a;
              font-weight: bold;
              font-size: 12px;
            }
            
            .footer {
              text-align: center;
              margin-top: 20px;
              padding: 15px;
              background: #f9fafb;
              border-radius: 6px;
              font-size: 10px;
              color: #6b7280;
            }
            
            .footer p {
              margin-bottom: 5px;
            }
            
            @media print {
              body { background: white; }
              .page { margin: 0; padding: 12mm; box-shadow: none; }
            }
          </style>
        </head>
        <body>
          ${generatePageHTML(page1Categories, 1)}
          ${page2Categories.length > 0 ? generatePageHTML(page2Categories, 2) : ''}
          ${page3Categories.length > 0 ? generatePageHTML(page3Categories, 3) : ''}
        </body>
        </html>
      `;

      function generatePageHTML(pageCategories, pageNum) {
        return `
          <div class="page">
            <div class="header">
              <h1>🎆 ASTRO CRACKERS</h1>
              <div class="subtitle">DIRECT FACTORY OUTLET</div>
              <div class="offer-badge">${discount}% OFFER</div>
              <div class="contact-info">
                <div class="contact-item">
                  📞 +91 8300372046
                </div>
                <div class="contact-item">
                  ✉️ crackers.astro@gmail.com
                </div>
              </div>
            </div>
            
            ${pageCategories.map(categoryData => `
              <div class="category-section">
                <div class="category-title">${categoryData.categoryName}</div>
                <table class="products-table">
                  <thead>
                    <tr>
                      <th>Image</th>
                      <th>Products</th>
                      <th>Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${categoryData.products.map(product => `
                      <tr>
                        <td>
                          <div class="product-image">
                            ${product.images && product.images[0] ? 
                              `<img src="${product.images[0]}" alt="${product.name}" />` : 
                              'No Image'
                            }
                          </div>
                        </td>
                        <td>
                          <div class="product-name">${product.name}</div>
                          ${product.isBestSeller ? '<span class="best-seller-badge">Best Seller</span>' : ''}
                        </td>
                        <td class="price-container">
                          <span class="original-price">₹${product.originalPrice}</span>
                          <span class="current-price">₹${product.price}</span>
                        </td>
                      </tr>
                    `).join('')}
                  </tbody>
                </table>
              </div>
            `).join('')}
            
            ${pageNum === 3 || (pageNum === 2 && page3Categories.length === 0) || (pageNum === 1 && page2Categories.length === 0 && page3Categories.length === 0) ? `
              <div class="footer">
                <p><strong>Explore a Wide Range of Crackers & Sparklers for all your Festival Celebration</strong></p>
                <p>Transportation charges to be paid by the customer</p>
                <p>Contact us: +91 8300372046 | crackers.astro@gmail.com</p>
                <p>Generated on: ${new Date().toLocaleDateString()}</p>
              </div>
            ` : ''}
          </div>
        `;
      }

      // Write content to new window
      printWindow.document.write(pdfContent);
      printWindow.document.close();
      
      // Wait for content to load, then print
      printWindow.onload = () => {
        setTimeout(() => {
          printWindow.print();
          printWindow.close();
        }, 500);
      };

    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate price list. Please try again.');
    } finally {
      setGeneratingPDF(false);
    }
  };

  // Cart functions
  const addToCart = (product) => {
    setCart(prev => ({
      ...prev,
      [product._id]: {
        ...product,
        quantity: (prev[product._id]?.quantity || 0) + 1
      }
    }));
  };

  const removeFromCart = (productId) => {
    setCart(prev => {
      const newCart = { ...prev };
      if (newCart[productId]?.quantity > 1) {
        newCart[productId].quantity -= 1;
      } else {
        delete newCart[productId];
      }
      return newCart;
    });
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity === 0) {
      setCart(prev => {
        const newCart = { ...prev };
        delete newCart[productId];
        return newCart;
      });
    } else {
      setCart(prev => ({
        ...prev,
        [prev[productId]._id]: {
          ...prev[productId],
          quantity
        }
      }));
    }
  };

  // Calculate totals
  const cartItems = Object.values(cart);
  const totalAmount = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const totalSavings = cartItems.reduce((sum, item) => {
    const originalPrice = calculateOriginalPrice(item.price);
    return sum + ((originalPrice - item.price) * item.quantity);
  }, 0);

  // Handle order submission
  const handleSubmitOrder = () => {
    if (cartItems.length === 0) {
      alert('Please add items to your cart before placing order');
      return;
    }
    setShowAddressModal(true);
  };

  const handleFinalSubmit = async () => {
    if (!customerDetails.name || !customerDetails.email || !customerDetails.phone || 
        !customerDetails.address.street || !customerDetails.address.city || 
        !customerDetails.address.state || !customerDetails.address.pincode) {
      alert('Please fill all required fields');
      return;
    }

    setSubmitting(true);
    
    try {
      const orderData = {
        orderNumber: `ORD${Date.now()}`,
        customerDetails,
        items: cartItems.map(item => ({
          productName: item.name,
          price: item.price,
          quantity: item.quantity,
          subtotal: item.price * item.quantity
        })),
        totalAmount,
        totalSavings,
        createdAt: new Date()
      };

      // Send order email (you'll need to implement this endpoint)
      const response = await fetch('http://localhost:5000/api/quick-order/send-confirmation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          to: customerDetails.email,
          user: customerDetails,
          order: orderData
        })
      });

      if (response.ok) {
        alert('Order placed successfully! You will receive confirmation email shortly.');
        setCart({});
        setCustomerDetails({
          name: '',
          email: '',
          phone: '',
          address: { street: '', city: '', state: '', pincode: '' }
        });
        setShowAddressModal(false);
      } else {
        throw new Error('Failed to send order confirmation');
      }
    } catch (error) {
      console.error('Order submission error:', error);
      alert('Failed to place order. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-red-600 font-medium">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 to-red-700 text-white p-6 shadow-lg">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold mb-2">🎆 ASTRO CRACKERS</h1>
              <p className="text-red-100">DIRECT FACTORY OUTLET</p>
              <div className="bg-yellow-400 text-red-800 px-4 py-1 rounded-full inline-block mt-2 font-bold">
                {discount}% OFFER
              </div>
            </div>
            <div className="mt-4 md:mt-0 text-center">
              {/* Download Price List Button */}
              <button
                onClick={downloadPriceList}
                disabled={generatingPDF || categories.length === 0}
                className="bg-white text-red-600 hover:bg-gray-100 font-bold py-2 px-4 rounded-lg transition-colors mb-3 flex items-center gap-2 mx-auto disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Download size={16} />
                {generatingPDF ? 'Generating...' : 'Download Price List'}
              </button>
              <div className="flex items-center gap-4 text-sm">
                <span className="flex items-center gap-1">
                  <Phone size={16} />
                  +91 8300372046
                </span>
                <span className="flex items-center gap-1">
                  <Mail size={16} />
                  crackers.astro@gmail.com
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-4">
        

        {/* Products by Category */}
        {categories.map((category) => (
          <div key={category} className="mb-8">
            <h2 className="text-2xl font-bold text-red-700 mb-4 uppercase border-b-2 border-red-200 pb-2">
              {category}
            </h2>
            
            {products[category]?.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No products available in this category
              </div>
            ) : (
              <div className="bg-white border-2 border-red-200 rounded-lg shadow-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-red-600 text-white">
                        <th className="p-3 text-left">Image</th>
                        <th className="p-3 text-left">Products</th>
                        <th className="p-3 text-center">Price</th>
                        <th className="p-3 text-center">Qty</th>
                        <th className="p-3 text-right">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products[category]?.map((product, index) => {
                        const originalPrice = calculateOriginalPrice(product.price);
                        const cartItem = cart[product._id];
                        const quantity = cartItem?.quantity || 0;
                        const amount = product.price * quantity;

                        return (
                          <tr key={product._id} className={`border-b hover:bg-red-50 ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}>
                            <td className="p-3">
                              <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden">
                                {product.images?.[0] ? (
                                  <img 
                                    src={product.images[0]} 
                                    alt={product.name}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                                    No Image
                                  </div>
                                )}
                              </div>
                            </td>
                            <td className="p-3">
                              <div>
                                <h4 className="font-bold text-gray-800">{product.name}</h4>
                                <p className="text-sm text-gray-600">{product.description}</p>
                                {product.isBestSeller && (
                                  <span className="inline-block bg-yellow-400 text-yellow-800 text-xs px-2 py-1 rounded mt-1">
                                    Best Seller
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="p-3 text-center">
                              <div>
                                <div className="text-gray-500 line-through text-sm">₹{originalPrice}</div>
                                <div className="text-green-600 font-bold">₹{product.price}</div>
                              </div>
                            </td>
                            <td className="p-3 text-center">
                              <div className="flex items-center justify-center gap-2">
                                <button
                                  onClick={() => removeFromCart(product._id)}
                                  className="w-8 h-8 bg-red-100 hover:bg-red-200 text-red-600 rounded-full flex items-center justify-center transition-colors"
                                  disabled={quantity === 0}
                                >
                                  <Minus size={16} />
                                </button>
                                <input
                                  type="number"
                                  value={quantity}
                                  onChange={(e) => updateQuantity(product._id, parseInt(e.target.value) || 0)}
                                  className="w-16 text-center border border-gray-300 rounded px-2 py-1"
                                  min="0"
                                />
                                <button
                                  onClick={() => addToCart(product)}
                                  className="w-8 h-8 bg-green-100 hover:bg-green-200 text-green-600 rounded-full flex items-center justify-center transition-colors"
                                >
                                  <Plus size={16} />
                                </button>
                              </div>
                            </td>
                            <td className="p-3 text-right font-bold text-red-600">
                              ₹{amount}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        ))}

        {/* Footer */}
        <div className="text-center py-8 text-gray-600">
          <p>Explore a Wide Range of Crackers & Sparklers for all your Festival Celebration</p>
          <p className="mt-4 text-sm">Transportation charges to be paid by the customer</p>
        </div>

        {/* Cart Summary - Bottom */}
        {cartItems.length > 0 && (
          <div className="bg-white border-2 border-red-200 rounded-lg shadow-lg p-4 mb-6 sticky bottom-11 z-10">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-red-700 flex items-center gap-2">
                <ShoppingCart size={20} />
                Your Cart ({cartItems.length} items)
              </h3>
              <div className="text-right">
                <div className="text-sm text-gray-600">Total Savings: <span className="text-green-600 font-bold">₹{totalSavings}</span></div>
                <div className="text-xl font-bold text-red-600">Total: ₹{totalAmount}</div>
              </div>
            </div>
            <button
              onClick={handleSubmitOrder}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
            >
              PLACE ORDER
            </button>
          </div>
        )}
      </div>

      {/* Address Modal */}
      {showAddressModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-90vh overflow-y-auto">
            <div className="p-6">
              <h3 className="text-xl font-bold text-red-700 mb-4">Customer Details</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <User size={16} className="inline mr-1" />
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={customerDetails.name}
                    onChange={(e) => setCustomerDetails({...customerDetails, name: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <Mail size={16} className="inline mr-1" />
                    Email *
                  </label>
                  <input
                    type="email"
                    value={customerDetails.email}
                    onChange={(e) => setCustomerDetails({...customerDetails, email: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <Phone size={16} className="inline mr-1" />
                    Phone *
                  </label>
                  <input
                    type="tel"
                    value={customerDetails.phone}
                    onChange={(e) => setCustomerDetails({...customerDetails, phone: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <MapPin size={16} className="inline mr-1" />
                    Street Address *
                  </label>
                  <textarea
                    value={customerDetails.address.street}
                    onChange={(e) => setCustomerDetails({
                      ...customerDetails,
                      address: {...customerDetails.address, street: e.target.value}
                    })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    rows="2"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
                    <input
                      type="text"
                      value={customerDetails.address.city}
                      onChange={(e) => setCustomerDetails({
                        ...customerDetails,
                        address: {...customerDetails.address, city: e.target.value}
                      })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">State *</label>
                    <input
                      type="text"
                      value={customerDetails.address.state}
                      onChange={(e) => setCustomerDetails({
                        ...customerDetails,
                        address: {...customerDetails.address, state: e.target.value}
                      })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Pincode *</label>
                  <input
                    type="text"
                    value={customerDetails.address.pincode}
                    onChange={(e) => setCustomerDetails({
                      ...customerDetails,
                      address: {...customerDetails.address, pincode: e.target.value}
                    })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    required
                  />
                </div>
              </div>

              <div className="border-t pt-4 mt-6">
                <div className="text-sm text-gray-600 mb-2">Order Summary:</div>
                <div className="text-sm">Total Items: {cartItems.length}</div>
                <div className="text-sm">Total Savings: <span className="text-green-600 font-bold">₹{totalSavings}</span></div>
                <div className="text-lg font-bold text-red-600">Total Amount: ₹{totalAmount}</div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowAddressModal(false)}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 font-bold py-2 px-4 rounded-lg transition-colors"
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button
                  onClick={handleFinalSubmit}
                  disabled={submitting}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition-colors disabled:opacity-50"
                >
                  {submitting ? 'Placing Order...' : 'Confirm Order'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuickOrder;