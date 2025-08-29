import api from "./api"; // axios instance

// Fetch all products
export const getAllProducts = async () => {
  const res = await api.get("/products");
  return res.data; // backend returns array of products
};

// Search with filters applied in frontend
export const searchProducts = async (query, filters) => {
  const allProducts = await getAllProducts();

  let results = allProducts;

  // 1. Filter by query (name + tags)
  if (query) {
    const lower = query.toLowerCase();
    results = results.filter(
      (p) =>
        p.name.toLowerCase().includes(lower) ||
        (p.tags && p.tags.some((t) => t.toLowerCase().includes(lower)))
    );
  }

  // 2. Filter by category
  if (filters.category && filters.category !== "all") {
    results = results.filter((p) => p.category === filters.category);
  }

  // 3. Filter by price range
  if (filters.priceRange) {
    const [min, max] = filters.priceRange.split("-").map(Number);
    results = results.filter((p) => {
      if (isNaN(max)) return p.price >= min; // "1000+" case
      return p.price >= min && p.price <= max;
    });
  }

  // 4. Sort
  if (filters.sortBy === "priceLowHigh") {
    results = results.sort((a, b) => a.price - b.price);
  } else if (filters.sortBy === "priceHighLow") {
    results = results.sort((a, b) => b.price - a.price);
  } else if (filters.sortBy === "newest") {
    results = results.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
  }

  return {
    products: results,
    total: results.length,
  };
};
