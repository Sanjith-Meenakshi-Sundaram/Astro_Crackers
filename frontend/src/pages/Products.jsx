import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getAllProducts } from "../services/product.service";
import ProductCard from "../components/ProductCard";

export default function Products() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchParams] = useSearchParams();
    const [error, setError] = useState(null);

    const category = searchParams.get("category");

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            setError(null);
            try {
                const res = await getAllProducts();
                const allProducts = res.products; // ✅ extract array

                // filter by category (if query param exists)
                const filtered =
                    category && category !== "all"
                        ? allProducts.filter((p) => p.category === category)
                        : allProducts;

                setProducts(filtered);

            } catch (err) {
                setError("Failed to load products. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [category]);

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">
                {category ? `${category} Crackers` : "All Products"}
            </h1>

            {loading && (
                <div className="flex justify-center py-10">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-800"></div>
                </div>
            )}

            {error && (
                <p className="text-red-500 text-center mt-10 font-semibold">{error}</p>
            )}

            {!loading && !error && products.length === 0 && (
                <p className="text-gray-500 text-center mt-10">
                    No products found for this category.
                </p>
            )}

            {!loading && !error && products.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                    {products.map((product) => (
                        <ProductCard key={product._id} product={product} />
                    ))}
                </div>
            )}
        </div>
    );
}
