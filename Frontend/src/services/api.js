// Cliente HTTP centralizado basado en fetch.
// Reemplaza a axios: aquí viven get/post/put/patch/del y el manejo común de
// base URL, token JWT, serialización JSON, query params y errores.
import { getValidToken } from "./token";

// VITE_API_URL debe incluir el prefijo /api (ej: http://localhost:3000/api).
// Se elimina la barra final por si acaso para evitar dobles //.
export const API_BASE = (
  import.meta.env.VITE_API_URL || "http://localhost:3000/api"
).replace(/\/$/, "");

// URL absoluta hacia el backend (útil para redirecciones como Google OAuth).
export const apiUrl = (path = "") => `${API_BASE}${path}`;

// Añade ?a=1&b=2 ignorando valores vacíos/null/undefined.
const withQuery = (path, params) => {
  if (!params) return path;
  const qs = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      qs.append(key, value);
    }
  });
  const query = qs.toString();
  return query ? `${path}?${query}` : path;
};

/**
 * Petición genérica.
 * @param {string} method  GET | POST | PUT | PATCH | DELETE
 * @param {string} path    Ruta relativa a /api (ej: "/admin/products")
 * @param {object} options { body, params, headers, auth }
 *   - auth: true por defecto. Si hay token en localStorage se envía como Bearer.
 */
async function request(method, path, { body, params, headers, auth = true } = {}) {
  const finalHeaders = { ...headers };
  let payload;

  if (body !== undefined && body !== null) {
    if (body instanceof FormData) {
      payload = body; // el navegador pone el Content-Type con boundary
    } else {
      finalHeaders["Content-Type"] = "application/json";
      payload = JSON.stringify(body);
    }
  }

  if (auth) {
    const token = getValidToken();
    if (token) finalHeaders.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(apiUrl(withQuery(path, params)), {
    method,
    headers: finalHeaders,
    body: payload,
  });

  // 204 No Content u otras respuestas sin cuerpo.
  const contentType = res.headers.get("content-type") || "";
  const isJson = contentType.includes("application/json");
  const data = res.status === 204
    ? null
    : isJson
      ? await res.json().catch(() => null)
      : await res.text();

  if (!res.ok) {
    const message =
      (data && typeof data === "object" && (data.message || data.error)) ||
      (typeof data === "string" && data) ||
      `Error ${res.status}`;
    const error = new Error(message);
    error.status = res.status;
    error.data = data;
    throw error;
  }

  return data;
}

export const api = {
  get: (path, options) => request("GET", path, options),
  post: (path, body, options) => request("POST", path, { ...options, body }),
  put: (path, body, options) => request("PUT", path, { ...options, body }),
  patch: (path, body, options) => request("PATCH", path, { ...options, body }),
  del: (path, options) => request("DELETE", path, options),
};

export default api;
