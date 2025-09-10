import React, { useState, useEffect, useCallback } from "react";

// FeaturedForm component moved outside to prevent re-creation on every render
const FeaturedForm = ({
  isEdit = false,
  formData,
  handleInputChange,
  handleArrayChange,
  addArrayItem,
  removeArrayItem,
  handleFormSubmit,
  submitLoading,
  setShowAddModal,
  setShowEditModal,
  resetForm
}) => (
  <div className="max-h-80 overflow-y-auto">
    {/* Wrap everything in a real form */}
    <form
      className="space-y-4"
      onSubmit={(e) => handleFormSubmit(e, isEdit)}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Product Name *
          </label>
          <input
            type="text"
            name="name"
            className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Enter product name"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Price *
          </label>
          <input
            type="number"
            name="price"
            step="0.01"
            className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all"
            value={formData.price}
            onChange={handleInputChange}
            placeholder="0.00"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">
          Description *
        </label>
        <textarea
          name="description"
          className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all"
          rows="2"
          value={formData.description}
          onChange={handleInputChange}
          placeholder="Describe your featured product"
          required
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">
          Category *
        </label>
        <select
          name="category"
          className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all"
          value={formData.category}
          onChange={handleInputChange}
          required
        >
          <option value="" disabled>
            Select a category
          </option>
          <option value="morning crackers">morning crackers</option>
          <option value="night crackers">night crackers</option>
          <option value="premium skyshots">premium skyshots</option>
          <option value="kids special">kids special</option>
          <option value="gift boxes">gift boxes</option>
        </select>
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">
          Product Images (URLs)
        </label>
        {formData.images.map((img, i) => (
          <div key={`image-${i}`} className="flex gap-2 mb-2">
            <input
              type="text"
              className="flex-1 border border-gray-300 rounded-md p-2 text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all"
              value={img}
              onChange={(e) => handleArrayChange(i, e.target.value, "images")}
              onPaste={(e) => {
                e.stopPropagation();
                setTimeout(() => {
                  handleArrayChange(i, e.target.value, "images");
                }, 0);
              }}
              placeholder="https://example.com/image.jpg"
              required={i === 0}
            />
            {formData.images.length > 1 && (
              <button
                type="button"
                className="px-2 py-1 bg-red-500 hover:bg-red-600 text-white rounded-md transition-colors text-xs"
                onClick={() => removeArrayItem(i, "images")}
              >
                ×
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition-colors text-xs font-medium"
          onClick={() => addArrayItem("images")}
        >
          + Add Image
        </button>
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">
          Tags
        </label>
        {formData.tags.map((tag, i) => (
          <div key={`tag-${i}`} className="flex gap-2 mb-2">
            <input
              type="text"
              className="flex-1 border border-gray-300 rounded-md p-2 text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all"
              value={tag}
              onChange={(e) => handleArrayChange(i, e.target.value, "tags")}
              onPaste={(e) => {
                e.stopPropagation();
                setTimeout(() => {
                  handleArrayChange(i, e.target.value, "tags");
                }, 0);
              }}
              placeholder="Enter tag"
            />
            <button
              type="button"
              className="px-2 py-1 bg-red-500 hover:bg-red-600 text-white rounded-md transition-colors text-xs"
              onClick={() => removeArrayItem(i, "tags")}
            >
              ×
            </button>
          </div>
        ))}
        <button
          type="button"
          className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition-colors text-xs font-medium"
          onClick={() => addArrayItem("tags")}
        >
          + Add Tag
        </button>
      </div>

      <div className="flex items-center gap-4">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            name="isBestSeller"
            checked={formData.isBestSeller}
            onChange={handleInputChange}
            className="w-3 h-3 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
          />
          <span className="text-xs font-medium text-gray-700">Best Seller</span>
        </label>

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            name="isActive"
            checked={formData.isActive}
            onChange={handleInputChange}
            className="w-3 h-3 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
          />
          <span className="text-xs font-medium text-gray-700">Active</span>
        </label>
      </div>

      <div className="flex gap-2 pt-3">
        <button
          type="submit"
          disabled={submitLoading}
          className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm"
        >
          {submitLoading
            ? "Processing..."
            : isEdit
              ? "Update Featured"
              : "Add Featured"}
        </button>
        <button
          type="button"
          className="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-md font-medium transition-all text-sm"
          onClick={() => {
            isEdit ? setShowEditModal(false) : setShowAddModal(false);
            resetForm();
          }}
        >
          Cancel
        </button>
      </div>
    </form>
  </div>
);

const AdminFeatured = () => {
  const [featured, setFeatured] = useState([]);
  const [filteredFeatured, setFilteredFeatured] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingFeatured, setEditingFeatured] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState({
    show: false,
    featuredId: null,
  });
  const [submitLoading, setSubmitLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    images: [""],
    tags: [""],
    category: "",
    isBestSeller: false,
    isActive: true,
  });

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  // Get auth token (admin first)
  const getAuthToken = () => {
    // Prefer admin token for /api/owner/* routes
    const adminToken = localStorage.getItem('adminToken');
    if (adminToken) return adminToken;

    // Fallback to normal token (if you ever use non-owner routes here)
    const token = localStorage.getItem('token');
    if (token) return token;

    // Cookie fallback
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
      const [name, value] = cookie.trim().split('=');
      if (name === 'adminToken' || name === 'token' || name === 'authToken') {
        return value;
      }
    }

    return sessionStorage.getItem('adminToken') || sessionStorage.getItem('token');
  };

  // Auth headers helper
  const getAuthHeaders = () => {
    const token = getAuthToken();
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` })
    };
  };

  // Fetch featured
  const fetchFeatured = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/api/featured`);
      if (!response.ok) throw new Error("Failed to fetch featured products");

      const data = await response.json();
      const featuredList = Array.isArray(data) ? data : data.featured || [];

      setFeatured(featuredList);
      setFilteredFeatured(featuredList);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [API_URL]);

  useEffect(() => {
    fetchFeatured();
  }, [fetchFeatured]);

  // Search
  useEffect(() => {
    let filtered = featured;

    if (searchTerm) {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (product.tags &&
            product.tags.some((tag) =>
              tag.toLowerCase().includes(searchTerm.toLowerCase())
            ))
      );
    }

    setFilteredFeatured(filtered);
  }, [searchTerm, featured]);

  // Input handler
  const handleInputChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }, []);

  // Array input - Fixed to prevent re-rendering issues
  const handleArrayChange = useCallback((index, value, field) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].map((item, i) => (i === index ? value : item)),
    }));
  }, []);

  const addArrayItem = useCallback((field) => {
    setFormData((prev) => ({
      ...prev,
      [field]: [...prev[field], ""],
    }));
  }, []);

  const removeArrayItem = useCallback((index, field) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  }, []);

  const resetForm = useCallback(() => {
    setFormData({
      name: "",
      description: "",
      price: "",
      images: [""],
      tags: [""],
      category: "",
      isBestSeller: false,
      isActive: true,
    });
  }, []);

  // CRUD handlers
  const handleAddFeatured = async (e) => {
    e.preventDefault();
    try {
      setSubmitLoading(true);
      const featuredData = {
        ...formData,
        price: parseFloat(formData.price),
        images: formData.images.filter((img) => img.trim() !== ""),
        tags: formData.tags.filter((tag) => tag.trim() !== ""),
      };

      const res = await fetch(`${API_URL}/api/featured`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(featuredData),
      });

      if (!res.ok) {
        if (res.status === 401) {
          throw new Error("Unauthorized. Please login as admin.");
        }
        throw new Error("Failed to add featured product");
      }

      await fetchFeatured();
      setShowAddModal(false);
      resetForm();
      setError(""); // Clear any previous errors
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleEditClick = (product) => {
    setEditingFeatured(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      images: product.images.length > 0 ? product.images : [""],
      tags: product.tags && product.tags.length > 0 ? product.tags : [""],
      category: product.category || "",
      isBestSeller: product.isBestSeller,
      isActive: product.isActive,
    });
    setShowEditModal(true);
  };

  const handleUpdateFeatured = async (e) => {
    e.preventDefault();
    try {
      setSubmitLoading(true);
      const featuredData = {
        ...formData,
        price: parseFloat(formData.price),
        images: formData.images.filter((img) => img.trim() !== ""),
        tags: formData.tags.filter((tag) => tag.trim() !== ""),
      };

      const res = await fetch(
        `${API_URL}/api/featured/${editingFeatured._id}`,
        {
          method: "PUT",
          headers: getAuthHeaders(),
          body: JSON.stringify(featuredData),
        }
      );

      if (!res.ok) {
        if (res.status === 401) {
          throw new Error("Unauthorized. Please login as admin.");
        }
        throw new Error("Failed to update featured product");
      }

      await fetchFeatured();
      setShowEditModal(false);
      setEditingFeatured(null);
      resetForm();
      setError(""); // Clear any previous errors
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDeleteClick = (id) => {
    setDeleteConfirm({ show: true, featuredId: id });
  };

  const confirmDelete = async () => {
    try {
      setSubmitLoading(true);
      const res = await fetch(
        `${API_URL}/api/featured/${deleteConfirm.featuredId}`,
        {
          method: "DELETE",
          headers: getAuthHeaders(),
        }
      );

      if (!res.ok) {
        if (res.status === 401) {
          throw new Error("Unauthorized. Please login as admin.");
        }
        throw new Error("Failed to delete featured product");
      }

      await fetchFeatured();
      setDeleteConfirm({ show: false, featuredId: null });
      setError(""); // Clear any previous errors
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleFormSubmit = useCallback((e, isEdit) => {
    e.preventDefault();
    if (isEdit) {
      handleUpdateFeatured(e);
    } else {
      handleAddFeatured(e);
    }
  }, [formData]);

  return (
    <div className="min-h-screen bg-gray-50 p-3">
      <div className="max-w-7xl mx-auto">
        {/* Compact Header */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-xl font-bold text-gray-900">Featured Management</h1>
              <p className="text-gray-600 text-sm mt-0.5">Manage your featured products</p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium transition-all text-sm"
            >
              + Add Featured
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="text-red-400 mr-2 text-sm">⚠</div>
                <p className="text-red-800 font-medium text-sm">{error}</p>
              </div>
              <button
                onClick={() => setError("")}
                className="text-red-400 hover:text-red-600 font-bold text-lg"
              >
                ×
              </button>
            </div>
          </div>
        )}

        {/* Compact Search */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
          <div className="flex">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search featured products..."
                className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Compact Featured grid */}
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : filteredFeatured.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <div className="text-gray-400 text-3xl mb-2">⭐</div>
            <h3 className="text-lg font-semibold text-gray-600 mb-1">No featured products found</h3>
            <p className="text-gray-500 text-sm">Add your first featured product to get started.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {filteredFeatured.map((p) => (
              <div
                key={p._id}
                className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden border border-yellow-200"
              >
                <div className="relative">
                  <img
                    src={p.images[0] || "/logo_astro.png"}
                    alt={p.name}
                    className="w-full h-32 object-contain"
                    onError={(e) => {
                      e.onerror = null;
                      e.target.src = "/logo_astro.png";
                    }}
                  />

                  <div className="absolute top-1 left-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-1 py-0.5 rounded text-xs font-medium">
                    ⭐ Featured
                  </div>

                  {p.isBestSeller && (
                    <div className="absolute top-1 right-1 bg-yellow-400 text-yellow-900 px-1 py-0.5 rounded text-xs font-medium">
                      ★ Best
                    </div>
                  )}
                  {!p.isActive && (
                    <div className="absolute bottom-1 right-1 bg-red-500 text-white px-1 py-0.5 rounded text-xs font-medium">
                      Inactive
                    </div>
                  )}
                </div>

                <div className="p-3">
                  <h3 className="font-medium text-sm text-gray-900 mb-1 line-clamp-2">
                    {p.name}
                  </h3>
                  <p className="text-lg font-bold text-green-600 mb-2">
                    ₹{p.price}
                  </p>
                  <p className="text-xs text-gray-600 mb-3 line-clamp-2">
                    {p.description}
                  </p>

                  <div className="flex gap-1">
                    <button
                      className="flex-1 px-2 py-1 bg-yellow-400 hover:bg-yellow-500 text-yellow-900 rounded text-xs font-medium transition-all"
                      onClick={() => handleEditClick(p)}
                    >
                      Edit
                    </button>
                    <button
                      className="flex-1 px-2 py-1 bg-red-500 hover:bg-red-600 text-white rounded text-xs font-medium transition-all"
                      onClick={() => handleDeleteClick(p._id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Compact Add/Edit Modal */}
        {(showAddModal || showEditModal) && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
              <div className="flex justify-between items-center p-4 border-b border-gray-200">
                <h2 className="text-lg font-bold text-gray-900">
                  {showEditModal ? "Edit Featured Product" : "Add New Featured Product"}
                </h2>
                <button
                  onClick={() => {
                    showEditModal
                      ? setShowEditModal(false)
                      : setShowAddModal(false);
                    resetForm();
                  }}
                  className="text-gray-400 hover:text-gray-600 text-xl font-bold"
                >
                  ×
                </button>
              </div>
              <div className="p-4">
                <FeaturedForm
                  isEdit={showEditModal}
                  formData={formData}
                  handleInputChange={handleInputChange}
                  handleArrayChange={handleArrayChange}
                  addArrayItem={addArrayItem}
                  removeArrayItem={removeArrayItem}
                  handleFormSubmit={handleFormSubmit}
                  submitLoading={submitLoading}
                  setShowAddModal={setShowAddModal}
                  setShowEditModal={setShowEditModal}
                  resetForm={resetForm}
                />
              </div>
            </div>
          </div>
        )}

        {/* Compact Delete confirmation */}
        {deleteConfirm.show && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-sm">
              <div className="p-4 text-center">
                <div className="text-red-400 text-2xl mb-2">🗑</div>
                <h2 className="text-lg font-bold text-gray-900 mb-1">
                  Delete Featured Product
                </h2>
                <p className="text-gray-600 text-sm mb-4">
                  Are you sure you want to delete this featured product? This action cannot be undone.
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={confirmDelete}
                    disabled={submitLoading}
                    className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                  >
                    {submitLoading ? "Deleting..." : "Yes, Delete"}
                  </button>
                  <button
                    onClick={() =>
                      setDeleteConfirm({ show: false, featuredId: null })
                    }
                    className="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-md font-medium transition-all text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminFeatured;