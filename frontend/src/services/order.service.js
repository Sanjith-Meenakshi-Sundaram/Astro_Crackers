import api from "./api";

const OrderService = {
  createOrder: (payload) => api.post("/api/orders", payload),
};

export default OrderService;
