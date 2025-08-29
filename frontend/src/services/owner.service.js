import api from "./api";

// admin/owner endpoints - api instance will attach ownerToken if present
const OwnerService = {
  addProduct: (payload) => api.post("/api/owner/products", payload),
  updateProduct: (id, payload) => api.put(`/api/owner/products/${id}`, payload),
  deleteProduct: (id) => api.delete(`/api/owner/products/${id}`),
};

export default OwnerService;
