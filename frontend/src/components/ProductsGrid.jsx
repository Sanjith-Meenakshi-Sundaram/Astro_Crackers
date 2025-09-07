import React from "react";
import { Link } from "react-router-dom";
import { Star, Heart, ShoppingCart } from "lucide-react";

const ProductsGrid = ({ products }) => {
  // Calculate original price function
  const calculateOriginalPrice = (sellingPrice, discount = 80) => {
    return Math.round((sellingPrice * 100) / (100 - discount));
  };

  // Calculate discount percentage
  const calculateDiscountPercentage = (originalPrice, sellingPrice) => {
    return Math.round(((originalPrice - sellingPrice) / originalPrice) * 100);
  };

  if (!products || products.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 text-4xl mb-4">📦</div>
        <h3 className="text-lg font-semibold text-gray-600 mb-2">No products found</h3>
        <p className="text-gray-500">Check back later for new products.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4">
      {products.map((product) => {
        const sellingPrice = product.price;
        const discount = product.discount || 80; // Default 80% or from backend
        const originalPrice = calculateOriginalPrice(sellingPrice, discount);
        const discountPercentage = calculateDiscountPercentage(originalPrice, sellingPrice);

        return (
          <div
            key={product._id}
            className="bg-white rounded-lg border border-gray-200 hover:border-red-300 hover:shadow-md overflow-hidden group transition-all duration-300 relative"
          >
            {/* Top badges */}
            <div className="absolute top-2 left-2 right-2 flex justify-between items-start z-10">
              <div className="flex flex-col gap-1">
                {product.isBestSeller && (
                  <span className="bg-red-600 text-white text-xs px-1.5 py-0.5 rounded-full font-medium shadow-sm">
                    ★
                  </span>
                )}
                {discountPercentage > 0 && (
                  <span className="bg-green-600 text-white text-xs px-1.5 py-0.5 rounded-full font-medium shadow-sm">
                    {discountPercentage}%
                  </span>
                )}
              </div>
              
              <button className="bg-white/90 backdrop-blur-sm p-1 rounded-full shadow-sm hover:bg-white transition-colors">
                <Heart size={12} className="text-gray-600" />
              </button>
            </div>

            <Link to={`/products/${product._id}`}>
              <div className="relative bg-gray-50">
                <img
                  src={product.images?.[0] || "https://placehold.co/200x200/f3f4f6/6b7280?text=No+Image"}
                  alt={product.name}
                  className="w-full h-32 sm:h-36 object-contain p-2 group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://placehold.co/200x200/f3f4f6/6b7280?text=Error";
                  }}
                />
              </div>

              <div className="p-2 sm:p-3">
                {/* Product category */}
                {product.category && (
                  <p className="text-gray-500 text-xs font-medium uppercase tracking-wide mb-1 truncate">
                    {product.category}
                  </p>
                )}
                
                {/* Product name */}
                <h3 className="text-gray-800 font-medium text-xs sm:text-sm leading-tight mb-2 line-clamp-2 group-hover:text-red-600 transition-colors">
                  {product.name}
                </h3>
                
                {/* Rating (if available) */}
                {product.rating && (
                  <div className="flex items-center gap-1 mb-2">
                    <div className="flex items-center gap-0.5 bg-green-600 text-white px-1 py-0.5 rounded text-xs font-medium">
                      <span>{product.rating}</span>
                      <Star size={8} className="fill-white" />
                    </div>
                    <span className="text-gray-500 text-xs">({product.reviews || 0})</span>
                  </div>
                )}
                
                {/* Price section */}
                <div className="flex items-center gap-1 sm:gap-2 mb-2">
                  <span className="text-green-700 font-bold text-sm sm:text-base">₹{sellingPrice}</span>
                  {originalPrice > sellingPrice && (
                    <span className="text-gray-400 font-medium text-xs line-through">₹{originalPrice}</span>
                  )}
                </div>
                
                {/* Tags */}
                {product.tags && product.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-2">
                    {product.tags.slice(0, 1).map((tag, index) => (
                      <span 
                        key={index}
                        className="text-xs bg-red-50 text-red-600 px-1.5 py-0.5 rounded-full truncate max-w-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </Link>

            {/* Quick action button */}
            <div className="p-2 sm:p-3 pt-0">
              <button className="w-full bg-red-600 hover:bg-red-700 text-white py-1.5 sm:py-2 px-2 rounded-md text-xs sm:text-sm font-medium transition-colors flex items-center justify-center gap-1">
                <ShoppingCart size={12} />
                <span className="hidden sm:inline">Add to Cart</span>
                <span className="sm:hidden">Add</span>
              </button>
            </div>
            
            {/* Delivery info */}
            <div className="px-2 sm:px-3 pb-2">
              <p className="text-xs text-gray-500 flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                Free delivery
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ProductsGrid;