import React from "react";
import { Star, Eye } from "lucide-react";

const ProductCardSimple = ({ product }) => {
  if (!product) return null;

  // Calculate original price
  const sellingPrice = product.price;
  const discount = product.discount || 80;
  const originalPrice = Math.round((sellingPrice * 100) / (100 - discount));
  const discountPercentage = Math.round(((originalPrice - sellingPrice) / originalPrice) * 100);

  return (
    <div className="bg-white rounded-lg border border-gray-200 hover:border-red-300 hover:shadow-lg overflow-hidden group transition-all duration-300 relative">
      {/* Top badges (Bestseller & discount) */}
      <div className="absolute top-2 left-2 right-2 flex justify-between items-start z-10">
        <div className="flex flex-col gap-1">
          {product.isBestSeller && (
            <span className="bg-red-600 text-white text-xs px-2 py-1 rounded-full font-medium shadow-sm">
              ★ Bestseller
            </span>
          )}
          {discountPercentage > 0 && (
            <span className="bg-green-600 text-white text-xs px-2 py-1 rounded-full font-medium shadow-sm">
              {discountPercentage}% OFF
            </span>
          )}
        </div>
      </div>

      {/* Product Image */}
      <div className="relative bg-gray-50">
        <img
          src={
            product.images?.[0] ||
            "https://placehold.co/300x300/f3f4f6/6b7280?text=No+Image"
          }
          alt={product.name || "Product Image"}
          className="w-full h-44 object-contain p-2 group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src =
              "https://placehold.co/300x300/f3f4f6/6b7280?text=Error";
          }}
        />

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
          <div className="flex gap-2">
            <div className="bg-white p-2 rounded-full shadow-lg">
              <Eye size={16} className="text-gray-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Product Content */}
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
              <Star size={10} className="fill-white" />
            </div>
            <span className="text-gray-500 text-xs">
              ({product.reviews || 0})
            </span>
          </div>
        )}

        <div className="flex items-center gap-2 mb-3">
          <span className="text-green-700 font-bold text-lg">
            ₹{sellingPrice}
          </span>
          {originalPrice > sellingPrice && (
            <span className="text-gray-400 font-medium text-sm line-through">
              ₹{originalPrice}
            </span>
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

      {/* Delivery info */}
      <div className="px-3 pb-3">
        <p className="text-xs text-gray-500 flex items-center gap-1">
          <span className="w-2 h-2 bg-green-500 rounded-full"></span>
          Fast Festival Delivery
        </p>
      </div>
    </div>
  );
};

export default ProductCardSimple;
