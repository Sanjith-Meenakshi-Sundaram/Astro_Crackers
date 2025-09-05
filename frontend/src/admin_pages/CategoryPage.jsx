import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const CategoryPage = () => {
  const { type } = useParams(); // "products", "featured", "orders"
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ name: "", description: "", price: "", images: [] });
  const [editingId, setEditingId] = useState(null);

  // Map category to API URL
  const apiMap = {
    products: "/api/products",
    featured: "/api/featured",
    orders: "/api/orders",
  };

  const ownerApiMap = {
    products: "/api/owner/products",
    featured: "/api/featured",
  };

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${import.meta.env.VITE_API_URL}${apiMap[type]}`);
        const data = await res.json();
        setItems(data);
      } catch (err) {
        console.error("Error fetching:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [type]);

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Add or Edit product
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingId
        ? `${import.meta.env.VITE_API_URL}${ownerApiMap[type]}/${editingId}`
        : `${import.meta.env.VITE_API_URL}${ownerApiMap[type]}`;

      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Failed to save");
      alert(editingId ? "Updated successfully" : "Added successfully");

      setFormData({ name: "", description: "", price: "", images: [] });
      setEditingId(null);

      // refresh list
      const updated = await fetch(`${import.meta.env.VITE_API_URL}${apiMap[type]}`).then((r) => r.json());
      setItems(updated);
    } catch (err) {
      console.error(err);
      alert("Error saving item");
    }
  };

  // Delete product
  const handleDelete = async (id) => {
    if (!confirm("Are you sure?")) return;
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}${ownerApiMap[type]}/${id}`,
        { method: "DELETE" }
      );
      if (!res.ok) throw new Error("Delete failed");
      setItems(items.filter((i) => i._id !== id));
    } catch (err) {
      console.error(err);
      alert("Error deleting item");
    }
  };

  // Start editing
  const handleEdit = (item) => {
    setEditingId(item._id);
    setFormData({
      name: item.name,
      description: item.description,
      price: item.price,
      images: item.images || [],
    });
  };

  return (
    <div className="p-4 sm:p-6">
      <h1 className="text-xl sm:text-2xl font-bold capitalize mb-4">
        {type}
      </h1>

      {/* Orders only: just list */}
      {type === "orders" ? (
        loading ? (
          <p>Loading...</p>
        ) : (
          <div className="space-y-4">
            {items.map((order) => (
              <div
                key={order._id}
                className="bg-white p-4 rounded shadow border"
              >
                <h2 className="font-semibold">Order #{order._id}</h2>
                <p className="text-sm text-gray-600">
                  Customer: {order.customerName}
                </p>
                <p className="text-sm text-gray-600">
                  Total: ₹{order.totalAmount}
                </p>
              </div>
            ))}
          </div>
        )
      ) : (
        <>
          {/* Add/Edit Form */}
          <form
            onSubmit={handleSubmit}
            className="mb-6 bg-white p-4 rounded shadow border max-w-md"
          >
            <h2 className="text-lg font-semibold mb-2">
              {editingId ? "Edit Item" : "Add New Item"}
            </h2>
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={formData.name}
              onChange={handleChange}
              className="w-full mb-2 p-2 border rounded"
              required
            />
            <input
              type="text"
              name="description"
              placeholder="Description"
              value={formData.description}
              onChange={handleChange}
              className="w-full mb-2 p-2 border rounded"
              required
            />
            <input
              type="number"
              name="price"
              placeholder="Price"
              value={formData.price}
              onChange={handleChange}
              className="w-full mb-2 p-2 border rounded"
              required
            />
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              {editingId ? "Update" : "Add"}
            </button>
          </form>

          {/* Products List */}
          {loading ? (
            <p>Loading...</p>
          ) : items.length === 0 ? (
            <p className="text-gray-500">No items found.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {items.map((item) => (
                <div
                  key={item._id}
                  className="bg-white border rounded-xl shadow-sm p-4"
                >
                  <h2 className="text-base sm:text-lg font-semibold mb-2">
                    {item.name}
                  </h2>
                  {item.images?.[0] && (
                    <img
                      src={item.images[0]}
                      alt={item.name}
                      className="w-full h-40 object-cover rounded-md mb-3"
                    />
                  )}
                  <p className="text-gray-700 text-sm mb-2">
                    Price: ₹{item.price}
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(item)}
                      className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(item._id)}
                      className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default CategoryPage;
