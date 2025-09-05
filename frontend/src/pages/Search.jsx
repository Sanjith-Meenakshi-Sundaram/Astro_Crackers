import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Search as SearchIcon, Filter, ChevronDown } from 'lucide-react';
import ProductsGrid from '../components/ProductsGrid';
import { searchProducts } from '../services/product.service';
import { CATEGORIES, PRICE_RANGES } from '../utils/constant';


const Search = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get search query from URL
  const searchParams = new URLSearchParams(location.search);
  const initialQuery = searchParams.get('q') || '';
  
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalResults, setTotalResults] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  
  // Filter states
  const [filters, setFilters] = useState({
    category: 'all',
    priceRange: null,
    sortBy: 'relevance'
  });

  // Search suggestions
  const [suggestions] = useState([
    'rockets',
    'sparklers',
    'fountains',
    'morning crackers',
    'night crackers',
    'kids special',
    'gift boxes',
    'premium skyshots'
  ]);

  // Perform search
  const performSearch = async (query = searchQuery, currentFilters = filters) => {
    if (!query.trim() && currentFilters.category === 'all') return;
    
    setLoading(true);
    try {
      const result = await searchProducts(query.trim(), currentFilters);
      setProducts(result.products);
      setTotalResults(result.total);
    } catch (error) {
      console.error('Search error:', error);
      setProducts([]);
      setTotalResults(0);
    } finally {
      setLoading(false);
    }
  };

  // Handle search input
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Update URL
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      performSearch();
    }
  };

  // Handle suggestion click
  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion);
    navigate(`/search?q=${encodeURIComponent(suggestion)}`);
    performSearch(suggestion);
  };

  // Handle filter change
  const handleFilterChange = (filterType, value) => {
    const newFilters = { ...filters, [filterType]: value };
    setFilters(newFilters);
    performSearch(searchQuery, newFilters);
  };

  // Clear filters
  const clearFilters = () => {
    const defaultFilters = {
      category: 'all',
      priceRange: null,
      sortBy: 'relevance'
    };
    setFilters(defaultFilters);
    performSearch(searchQuery, defaultFilters);
  };

  // Load initial search results
  useEffect(() => {
    if (initialQuery) {
      performSearch(initialQuery);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Search Header */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">
            {searchQuery ? `Search Results for "${searchQuery}"` : 'Search Products'}
          </h1>
          
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="relative mb-6">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <SearchIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for crackers, categories..."
              className="w-full pl-12 pr-4 py-4 text-lg border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all duration-200 shadow-sm"
              autoFocus
            />
          </form>

          {/* Search Suggestions */}
          {!searchQuery && !loading && products.length === 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Popular Searches</h3>
              <div className="flex flex-wrap gap-2">
                {suggestions.map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="px-4 py-2 bg-white border border-gray-300 rounded-full hover:border-red-500 hover:text-red-600 transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Results Count & Filters */}
          {(searchQuery || filters.category !== 'all') && (
            <div className="flex items-center justify-between mb-6">
              <div className="text-gray-600">
                {loading ? (
                  <span>Searching...</span>
                ) : (
                  <span>
                    {totalResults} {totalResults === 1 ? 'result' : 'results'} found
                  </span>
                )}
              </div>
              
              {/* Filter Toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:border-red-500 transition-colors"
              >
                <Filter size={18} />
                <span>Filters</span>
                <ChevronDown 
                  size={18} 
                  className={`transform transition-transform ${showFilters ? 'rotate-180' : ''}`} 
                />
              </button>
            </div>
          )}

          {/* Filters Panel */}
          {showFilters && (
            <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Category Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    value={filters.category}
                    onChange={(e) => handleFilterChange('category', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                  >
                    <option value="all">All Categories</option>
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                {/* Price Range Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price Range
                  </label>
                  <select
                    value={filters.priceRange || ''}
                    onChange={(e) => handleFilterChange('priceRange', e.target.value || null)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                  >
                    <option value="">Any</option>
                    {PRICE_RANGES.map((range, idx) => (
                      <option key={idx} value={range.label}>
                        {range.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Sort By Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sort By
                  </label>
                  <select
                    value={filters.sortBy}
                    onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                  >
                    <option value="relevance">Relevance</option>
                    <option value="priceLowHigh">Price: Low to High</option>
                    <option value="priceHighLow">Price: High to Low</option>
                    <option value="newest">Newest</option>
                  </select>
                </div>
              </div>

              {/* Clear Filters */}
              <div className="mt-6 flex justify-end">
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 text-sm bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Results */}
        {loading ? (
          <div className="text-center py-12">Loading...</div>
        ) : products.length > 0 ? (
          <ProductsGrid products={products} />
        ) : (
          searchQuery && (
            <div className="text-center text-gray-500 py-12">
              No products found. Try adjusting your search or filters.
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default Search;
