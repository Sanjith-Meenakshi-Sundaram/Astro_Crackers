import api from "./api";

const AuthService = {
  signup: (payload) => api.post("/api/auth/signup", payload),
  login: (payload) => api.post("/api/auth/login", payload),
  adminLogin: (payload) => api.post("/api/auth/admin-login", payload),
  getProfile: () => api.get("/api/auth/profile"),
  updateProfile: (payload) => api.put("/api/auth/profile", payload),
};

export default AuthService;
