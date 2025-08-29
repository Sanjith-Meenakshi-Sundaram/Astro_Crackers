import React from "react";
import { Link } from "react-router-dom";

const ProductsGrid = ({ products }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map((product) => (
        <Link
          to={`/products/${product._id}`}
          key={product._id}
          className="bg-white rounded-xl shadow hover:shadow-lg transition p-4 flex flex-col"
        >
          <img
            src={product.images?.[0] || "/placeholder.png"}
            alt={product.name}
            className="h-40 w-full object-cover rounded-lg mb-3"
          />
          <h3 className="text-gray-800 font-medium truncate">
            {product.name}
          </h3>
          <p className="text-red-600 font-bold mt-2">₹{product.price}</p>
        </Link>
      ))}
    </div>
  );
};

export default ProductsGrid;
