import api, { apiUrl } from "../../../services/api";

export const authService = {
  // POST /api/auth/login → { token, role, userType, id, username }
  login: (identifier, password) =>
    api.post("/auth/login", { identifier, password }, { auth: false }),

  // POST /api/auth/register (cliente)
  register: (payload) =>
    api.post("/auth/register", payload, { auth: false }),

  // GET /api/auth/profile
  getProfile: () => api.get("/auth/profile"),

  // PUT /api/auth/profile
  updateProfile: (payload) => api.put("/auth/profile", payload),

  // POST /api/auth/forgot-password → { resetUrl, token } (modo demo)
  forgotPassword: (email) =>
    api.post("/auth/forgot-password", { email }, { auth: false }),

  // POST /api/auth/reset-password
  resetPassword: (token, password) =>
    api.post("/auth/reset-password", { token, password }, { auth: false }),

  // URL de inicio del flujo Google OAuth en el backend.
  googleLoginUrl: () => apiUrl("/auth/google"),
};
