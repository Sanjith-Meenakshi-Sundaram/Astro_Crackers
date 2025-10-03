import React, { useState, useEffect } from 'react';
import { Plus, Minus, Download, Receipt, X, ShoppingCart, User, ArrowLeft, Search as SearchIcon } from 'lucide-react';

const InvoiceGenerator = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState({});
  const [loading, setLoading] = useState(true);
  const [invoice, setInvoice] = useState({});
  const [customerDetails, setCustomerDetails] = useState({
    name: '',
    phone: '',
    address: ''
  });
  const [showInvoice, setShowInvoice] = useState(false);
  const [generatingPDF, setGeneratingPDF] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [allProducts, setAllProducts] = useState([]);
  const [searchResults, setSearchResults] = useState([]);

  const categoryNames = [
    'morning crackers',
    'night crackers',
    'kids special',
    'premium skyshots',
    'gift boxes'
  ];

  const discount = 80;

  const calculateOriginalPrice = (sellingPrice) => {
    return Math.round((sellingPrice * 100) / (100 - discount));
  };

  const calculatePrices = (price) => {
    const sellingPrice = price;
    const originalPrice = calculateOriginalPrice(sellingPrice);
    const discountPercentage = Math.round(((originalPrice - sellingPrice) / originalPrice) * 100);

    return {
      sellingPrice,
      originalPrice,
      discountPercentage,
      savings: originalPrice - sellingPrice
    };
  };

  useEffect(() => {
    const fetchAllProducts = async () => {
      setLoading(true);
      try {
        // Fetch all products in one call
        const response = await fetch('https://astro-crackers.onrender.com/api/products?limit=1000&page=1');
        if (response.ok) {
          const data = await response.json();
          const productList = Array.isArray(data) ? data : data.products || [];
          
          // Store all products for search
          setAllProducts(productList);
          
          // Group by category
          const productsByCategory = {};
          categoryNames.forEach(cat => {
            productsByCategory[cat] = productList.filter(
              p => p.category.toLowerCase() === cat.toLowerCase()
            );
          });

          setProducts(productsByCategory);
          setCategories(categoryNames);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
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

  const addToInvoice = (product) => {
    setInvoice(prev => ({
      ...prev,
      [product._id]: {
        ...product,
        quantity: (prev[product._id]?.quantity || 0) + 1
      }
    }));
  };

  const removeFromInvoice = (productId) => {
    setInvoice(prev => {
      const newInvoice = { ...prev };
      if (newInvoice[productId]?.quantity > 1) {
        newInvoice[productId].quantity -= 1;
      } else {
        delete newInvoice[productId];
      }
      return newInvoice;
    });
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity === 0) {
      setInvoice(prev => {
        const newInvoice = { ...prev };
        delete newInvoice[productId];
        return newInvoice;
      });
    } else {
      setInvoice(prev => ({
        ...prev,
        [productId]: {
          ...prev[productId],
          quantity
        }
      }));
    }
  };

  // Client-side search - same logic as AdminProducts
  const handleSearch = (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    const filtered = allProducts.filter(product =>
      product.name.toLowerCase().includes(query.toLowerCase()) ||
      product.description.toLowerCase().includes(query.toLowerCase()) ||
      product.category.toLowerCase().includes(query.toLowerCase()) ||
      (product.tags && product.tags.some(tag =>
        tag.toLowerCase().includes(query.toLowerCase())
      ))
    );

    setSearchResults(filtered);
  };

  const invoiceItems = Object.values(invoice);
  
  let totalOriginalPrice = 0;
  let totalSellingPrice = 0;
  
  invoiceItems.forEach(item => {
    const prices = calculatePrices(item.price);
    totalOriginalPrice += prices.originalPrice * item.quantity;
    totalSellingPrice += prices.sellingPrice * item.quantity;
  });
  
  const totalSavings = totalOriginalPrice - totalSellingPrice;

  const generateInvoiceNumber = () => {
    return `INV${Date.now()}`;
  };

  const handleViewInvoice = () => {
    if (invoiceItems.length === 0) {
      alert('Please add items to generate invoice');
      return;
    }
    if (!customerDetails.name || !customerDetails.phone) {
      alert('Please fill customer name and phone number');
      return;
    }
    setShowInvoice(true);
  };

  const generatePDF = () => {
    if (!customerDetails.name || !customerDetails.phone) {
      alert('Please fill customer details');
      return;
    }

    setGeneratingPDF(true);
    
    try {
      const invoiceNumber = generateInvoiceNumber();
      const printWindow = window.open('', '_blank');
      
      const invoiceHTML = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Invoice - ${invoiceNumber}</title>
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            
            body {
              font-family: Arial, sans-serif;
              padding: 20mm;
              background: white;
              color: #333;
            }
            
            .invoice-container {
              max-width: 800px;
              margin: 0 auto;
              background: white;
            }
            
            .header {
              text-align: center;
              border-bottom: 3px solid #dc2626;
              padding-bottom: 20px;
              margin-bottom: 30px;
            }
            
            .company-name {
              font-size: 32px;
              font-weight: bold;
              color: #dc2626;
              margin-bottom: 5px;
            }
            
            .company-tagline {
              font-size: 12px;
              color: #666;
              margin-bottom: 10px;
            }
            
            .offer-badge {
              display: inline-block;
              background: #fbbf24;
              color: #b91c1c;
              padding: 5px 15px;
              border-radius: 20px;
              font-weight: bold;
              font-size: 12px;
            }
            
            .invoice-title {
              font-size: 24px;
              font-weight: bold;
              margin-top: 15px;
            }
            
            .info-section {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 30px;
              margin-bottom: 30px;
            }
            
            .info-box h3 {
              font-size: 14px;
              font-weight: bold;
              margin-bottom: 10px;
              color: #dc2626;
            }
            
            .info-box p {
              font-size: 12px;
              line-height: 1.6;
              color: #666;
            }
            
            .items-table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 20px;
            }
            
            .items-table thead {
              background: #dc2626;
              color: white;
            }
            
            .items-table th {
              padding: 12px;
              text-align: left;
              font-size: 12px;
              font-weight: bold;
            }
            
            .items-table td {
              padding: 10px 12px;
              border-bottom: 1px solid #e5e7eb;
              font-size: 11px;
            }
            
            .items-table tbody tr:nth-child(even) {
              background: #f9fafb;
            }
            
            .product-name {
              font-weight: 600;
              color: #1f2937;
            }
            
            .savings-text {
              color: #16a34a;
              font-size: 10px;
            }
            
            .line-through {
              text-decoration: line-through;
              color: #9ca3af;
            }
            
            .price-green {
              color: #16a34a;
              font-weight: 600;
            }
            
            .price-red {
              color: #dc2626;
              font-weight: bold;
            }
            
            .text-right {
              text-align: right;
            }
            
            .text-center {
              text-align: center;
            }
            
            .summary-section {
              margin-top: 30px;
              padding-top: 20px;
              border-top: 2px solid #e5e7eb;
            }
            
            .summary-row {
              display: flex;
              justify-content: space-between;
              padding: 8px 0;
              font-size: 13px;
            }
            
            .summary-row.total {
              font-size: 18px;
              font-weight: bold;
              border-top: 2px solid #dc2626;
              padding-top: 15px;
              margin-top: 10px;
            }
            
            .footer {
              margin-top: 40px;
              text-align: center;
              padding-top: 20px;
              border-top: 1px solid #e5e7eb;
            }
            
            .footer p {
              font-size: 11px;
              color: #666;
              margin: 5px 0;
            }
            
            @media print {
              body { padding: 0; }
              .invoice-container { max-width: 100%; }
            }
          </style>
        </head>
        <body>
          <div class="invoice-container">
            <div class="header">
              <div class="company-name">🎆 Astro Crackers</div>
              <div class="company-tagline">DIRECT FACTORY OUTLET</div>
              <div class="offer-badge">${discount}% OFFER</div>
              <div class="invoice-title">INVOICE</div>
            </div>
            
            <div class="info-section">
              <div class="info-box">
                <h3>Invoice Details</h3>
                <p><strong>Invoice No:</strong> ${invoiceNumber}</p>
                <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
              </div>
              
              <div class="info-box">
                <h3>Customer Details</h3>
                <p><strong>Name:</strong> ${customerDetails.name}</p>
                <p><strong>Phone:</strong> ${customerDetails.phone}</p>
                ${customerDetails.address ? `<p><strong>Address:</strong> ${customerDetails.address}</p>` : ''}
              </div>
            </div>
            
            <table class="items-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th class="text-center">Qty</th>
                  <th class="text-right">Original</th>
                  <th class="text-right">Price</th>
                  <th class="text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                ${invoiceItems.map(item => {
                  const prices = calculatePrices(item.price);
                  return `
                    <tr>
                      <td>
                        <div class="product-name">${item.name}</div>
                        <div class="savings-text">Saved: ₹${prices.savings * item.quantity}</div>
                      </td>
                      <td class="text-center">${item.quantity}</td>
                      <td class="text-right line-through">₹${prices.originalPrice}</td>
                      <td class="text-right price-green">₹${prices.sellingPrice}</td>
                      <td class="text-right price-red">₹${item.price * item.quantity}</td>
                    </tr>
                  `;
                }).join('')}
              </tbody>
            </table>
            
            <div class="summary-section">
              <div class="summary-row">
                <span>Original Price:</span>
                <span class="line-through">₹${totalOriginalPrice}</span>
              </div>
              <div class="summary-row">
                <span>Discount (${discount}%):</span>
                <span class="price-green">-₹${totalSavings}</span>
              </div>
              
              <div class="summary-row total">
                <span>Total Amount:</span>
                <span class="price-red">₹${totalSellingPrice}</span>
              </div>
            </div>
            
            <div class="footer">
              <p><strong>Thank you – See you on your next order!</strong></p>
              <p>Contact: +91 8300372046 | crackers.astro@gmail.com</p>
              <p>Your celebration, our crackers. See you next time!</p>
            </div>
          </div>
          
          <script>
            window.onload = function() {
              setTimeout(function() {
                window.print();
              }, 250);
            };
          </script>
        </body>
        </html>
      `;
      
      printWindow.document.write(invoiceHTML);
      printWindow.document.close();
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate invoice. Please try again.');
    } finally {
      setGeneratingPDF(false);
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
      <div className="bg-gradient-to-r from-red-600 to-red-700 text-white p-4 md:p-6 shadow-lg">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex-1 text-center">
              <h1 className="text-3xl md:text-4xl font-bold mb-2">🎆 ASTRO CRACKERS</h1>
              <p className="text-red-100 text-sm md:text-base">Invoice Generator - Direct Factory Outlet</p>
              <div className="bg-yellow-400 text-red-800 px-4 py-1 rounded-full inline-block mt-2 font-bold text-sm md:text-base">
                {discount}% OFFER
              </div>
            </div>
            
            <button
              onClick={() => setShowSearch(true)}
              className="bg-white text-red-600 hover:bg-red-50 p-3 rounded-full transition-colors shadow-lg flex-shrink-0 ml-4"
              title="Search Products"
            >
              <SearchIcon size={24} />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-4">
        <div className="bg-white rounded-lg shadow-lg border-2 border-red-200 p-4 md:p-6 mb-6">
          <h2 className="text-xl font-bold text-red-700 mb-4 flex items-center gap-2">
            <User size={20} />
            Customer Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Customer Name *
              </label>
              <input
                type="text"
                value={customerDetails.name}
                onChange={(e) => setCustomerDetails({ ...customerDetails, name: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="Enter customer name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number *
              </label>
              <input
                type="tel"
                value={customerDetails.phone}
                onChange={(e) => setCustomerDetails({ ...customerDetails, phone: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="Enter phone number"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address (Optional)
              </label>
              <input
                type="text"
                value={customerDetails.address}
                onChange={(e) => setCustomerDetails({ ...customerDetails, address: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="Enter address"
              />
            </div>
          </div>
        </div>

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
                        <th className="p-3 text-left">Product</th>
                        <th className="p-3 text-center">Price</th>
                        <th className="p-3 text-center">Quantity</th>
                        <th className="p-3 text-right">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products[category]?.map((product, index) => {
                        const prices = calculatePrices(product.price);
                        const invoiceItem = invoice[product._id];
                        const quantity = invoiceItem?.quantity || 0;
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
                                {product.isBestSeller && (
                                  <span className="inline-block bg-yellow-400 text-yellow-800 text-xs px-2 py-1 rounded mt-1">
                                    Best Seller
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="p-3 text-center">
                              <div>
                                <div className="text-gray-500 line-through text-sm">₹{prices.originalPrice}</div>
                                <div className="text-green-600 font-bold">₹{prices.sellingPrice}</div>
                                <div className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded inline-block mt-1">
                                  {prices.discountPercentage}% OFF
                                </div>
                              </div>
                            </td>
                            <td className="p-3 text-center">
                              <div className="flex items-center justify-center gap-2">
                                <button
                                  onClick={() => removeFromInvoice(product._id)}
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
                                  onClick={() => addToInvoice(product)}
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

        {invoiceItems.length > 0 && (
          <div className="bg-white border-2 border-red-200 rounded-lg shadow-lg p-6 sticky bottom-4 z-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
              <div>
                <h3 className="text-lg font-bold text-red-700 flex items-center gap-2 mb-2">
                  <ShoppingCart size={20} />
                  Invoice Summary ({invoiceItems.length} items)
                </h3>
                <div className="space-y-1 text-sm">
                  <div className="flex gap-2">
                    <span className="text-gray-600">Original Price:</span>
                    <span className="text-gray-500 line-through">₹{totalOriginalPrice}</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-green-600 font-medium">You Saved:</span>
                    <span className="text-green-600 font-bold">₹{totalSavings}</span>
                  </div>
                  <div className="flex gap-2 text-lg">
                    <span className="font-bold">Total Amount:</span>
                    <span className="text-red-600 font-bold">₹{totalSellingPrice}</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                <button
                  onClick={handleViewInvoice}
                  className="bg-gray-800 hover:bg-gray-900 text-white font-bold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <Receipt size={18} />
                  View Invoice
                </button>
                <button
                  onClick={generatePDF}
                  disabled={generatingPDF}
                  className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Download size={18} />
                  {generatingPDF ? 'Generating...' : 'Download PDF'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Search Modal */}
      {showSearch && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between z-10">
              <h3 className="font-bold text-xl text-gray-800">Search Products</h3>
              <button
                onClick={() => {
                  setShowSearch(false);
                  setSearchQuery('');
                  setSearchResults([]);
                }}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6">
              <div className="mb-6">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <SearchIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      handleSearch(e.target.value);
                    }}
                    placeholder="Search by product name, category, tags..."
                    className="w-full pl-10 pr-4 py-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                    autoFocus
                  />
                </div>
              </div>

              {searchResults.length > 0 ? (
                <div className="space-y-3">
                  <p className="text-sm text-gray-600 mb-4">
                    Found {searchResults.length} product{searchResults.length !== 1 ? 's' : ''}
                  </p>
                  {searchResults.map((product) => {
                    const prices = calculatePrices(product.price);
                    const currentQuantity = invoice[product._id]?.quantity || 0;

                    return (
                      <div
                        key={product._id}
                        className="border border-gray-200 rounded-lg p-4 hover:border-red-300 hover:shadow-md transition-all"
                      >
                        <div className="flex gap-4">
                          <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
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

                          <div className="flex-1">
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <h4 className="font-bold text-gray-800">{product.name}</h4>
                                {product.category && (
                                  <p className="text-xs text-gray-500 uppercase mt-1">{product.category}</p>
                                )}
                              </div>
                              {product.isBestSeller && (
                                <span className="bg-yellow-400 text-yellow-800 text-xs px-2 py-1 rounded-full font-medium">
                                  Best Seller
                                </span>
                              )}
                            </div>

                            <div className="flex items-center gap-2 mb-3">
                              <span className="text-gray-500 line-through text-sm">₹{prices.originalPrice}</span>
                              <span className="text-green-600 font-bold">₹{prices.sellingPrice}</span>
                              <span className="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded">
                                {prices.discountPercentage}% OFF
                              </span>
                            </div>

                            <div className="flex items-center gap-3">
                              {currentQuantity > 0 ? (
                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={() => removeFromInvoice(product._id)}
                                    className="w-8 h-8 bg-red-100 hover:bg-red-200 text-red-600 rounded-full flex items-center justify-center transition-colors"
                                  >
                                    <Minus size={16} />
                                  </button>
                                  <span className="w-12 text-center font-bold">{currentQuantity}</span>
                                  <button
                                    onClick={() => addToInvoice(product)}
                                    className="w-8 h-8 bg-green-100 hover:bg-green-200 text-green-600 rounded-full flex items-center justify-center transition-colors"
                                  >
                                    <Plus size={16} />
                                  </button>
                                </div>
                              ) : (
                                <button
                                  onClick={() => {
                                    addToInvoice(product);
                                    alert(`${product.name} added to invoice!`);
                                  }}
                                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                                >
                                  <Plus size={16} />
                                  Add to Invoice
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : searchQuery.trim() ? (
                <div className="text-center py-12 text-gray-500">
                  <SearchIcon size={48} className="mx-auto mb-4 text-gray-300" />
                  <h3 className="text-lg font-medium mb-2">No products found</h3>
                  <p className="text-sm">Try different keywords</p>
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <SearchIcon size={48} className="mx-auto mb-4 text-gray-300" />
                  <p className="text-sm">Start typing to search products</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {showInvoice && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between z-10">
              <button
                onClick={() => setShowInvoice(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors flex items-center gap-2"
              >
                <ArrowLeft size={18} />
                <span className="text-sm font-medium">Back</span>
              </button>
              <h3 className="font-bold text-xl text-gray-800">Invoice Details</h3>
              <button
                onClick={() => setShowInvoice(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6">
              <div className="text-center mb-6 pb-6 border-b-2 border-red-200">
                <h2 className="text-3xl font-extrabold text-red-600 mb-1">🎆 Astro Crackers</h2>
                <p className="text-sm text-gray-600">DIRECT FACTORY OUTLET</p>
                <div className="bg-yellow-400 text-red-800 px-3 py-1 rounded-full inline-block mt-2 font-bold text-sm">
                  {discount}% OFFER
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6 mb-6 text-sm">
                <div>
                  <h4 className="font-bold text-gray-800 mb-2">Invoice Details:</h4>
                  <p className="text-gray-600">Invoice No: {generateInvoiceNumber()}</p>
                  <p className="text-gray-600">Date: {new Date().toLocaleDateString()}</p>
                </div>
                <div>
                  <h4 className="font-bold text-gray-800 mb-2">Customer Details:</h4>
                  <p className="text-gray-600">Name: {customerDetails.name}</p>
                  <p className="text-gray-600">Phone: {customerDetails.phone}</p>
                  {customerDetails.address && (
                    <p className="text-gray-600">Address: {customerDetails.address}</p>
                  )}
                </div>
              </div>

              <div className="mb-6">
                <h4 className="font-bold text-gray-800 mb-3">Items:</h4>
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-red-600 text-white">
                      <tr>
                        <th className="p-2 text-left">Product</th>
                        <th className="p-2 text-center">Qty</th>
                        <th className="p-2 text-right">Original</th>
                        <th className="p-2 text-right">Price</th>
                        <th className="p-2 text-right">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {invoiceItems.map((item, index) => {
                        const prices = calculatePrices(item.price);
                        return (
                          <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                            <td className="p-2">
                              <div className="font-medium text-gray-800">{item.name}</div>
                              <div className="text-xs text-green-600">Saved: ₹{prices.savings * item.quantity}</div>
                            </td>
                            <td className="p-2 text-center">{item.quantity}</td>
                            <td className="p-2 text-right text-gray-500 line-through">₹{prices.originalPrice}</td>
                            <td className="p-2 text-right text-green-600 font-medium">₹{prices.sellingPrice}</td>
                            <td className="p-2 text-right font-bold text-red-600">₹{item.price * item.quantity}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="border-t-2 border-gray-200 pt-4 space-y-2">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Original Price:</span>
                  <span className="line-through">₹{totalOriginalPrice}</span>
                </div>
                <div className="flex justify-between text-sm text-green-600 font-medium">
                  <span>Discount ({discount}%):</span>
                  <span>-₹{totalSavings}</span>
                </div>
                <div className="flex justify-between text-xl font-bold text-red-600 border-t-2 pt-2">
                  <span>Total Amount:</span>
                  <span>₹{totalSellingPrice}</span>
                </div>
              </div>

              <div className="mt-6 text-center text-xs text-gray-600 border-t pt-4">
                <p className="font-medium mb-1">Thank you – See you on your next order!</p>
                <p>Contact: +91 8300372046 | crackers.astro@gmail.com</p>
              </div>
            </div>

            <div className="sticky bottom-0 bg-white border-t p-4 flex gap-3">
              <button
                onClick={generatePDF}
                disabled={generatingPDF}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Download size={18} />
                {generatingPDF ? 'Generating...' : 'Download PDF'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InvoiceGenerator;