import React from 'react';
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
  // Fallback for missing product data to prevent errors
  if (!product) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden group transition-transform transform hover:-translate-y-1">
      <Link to={`/products/${product._id}`}>
        <div className="relative">
          <img 
            src={product.images && product.images.length > 0 ? product.images[0] : 'https://placehold.co/400x400/ef4444/ffffff?text=No+Image'} 
            alt={product.name || 'Product Image'} 
            className="w-full h-40 md:h-56 object-cover" 
            onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/400x400/ef4444/ffffff?text=Error'; }}
          />
          {product.isBestSeller && (
            <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
              Bestseller
            </span>
          )}
        </div>
        <div className="p-4">
          <h3 className="text-sm md:text-base font-semibold text-gray-800 truncate">{product.name || 'Unnamed Product'}</h3>
          <p className="text-lg font-bold text-red-600 mt-1">₹{product.price || '0'}</p>
        </div>
      </Link>
      <div className="p-4 pt-0">
        <button className="w-full bg-gray-800 text-white py-2 rounded-lg text-sm font-semibold hover:bg-red-600 transition-colors">
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
