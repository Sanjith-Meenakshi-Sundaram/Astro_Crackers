// src/services/productService.js
import api from "./api"; // axios instance

// ✅ Fetch all products
export const getAllProducts = async () => {
  const res = await api.get("/api/products");
  return res.data; // backend returns array of products
};

// ✅ Search products via backend
export const searchProducts = async (query, filters = {}) => {
  try {
    const params = new URLSearchParams();

    if (filters.category && filters.category !== "all") {
      params.append("category", filters.category);
    }
    if (filters.priceRange) {
      params.append("priceRange", filters.priceRange);
    }
    if (filters.sortBy) {
      params.append("sortBy", filters.sortBy);
    }

    // pagination (optional)
    params.append("page", filters.page || 1);
    params.append("limit", filters.limit || 20);

    const res = await api.get(
      `/api/products/search/${encodeURIComponent(query)}?${params.toString()}`
    );

    return {
      products: res.data.products || [],
      total: res.data.pagination
        ? res.data.pagination.totalProducts
        : res.data.products?.length || 0,
    };
  } catch (err) {
    console.error("Search service error:", err);
    return { products: [], total: 0 };
  }
};
