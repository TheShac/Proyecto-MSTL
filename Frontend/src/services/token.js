// Helpers de token JWT compartidos.
// Un token expirado o ilegible se considera "sin sesión" (invitado) y se
// elimina de localStorage, para que el flujo de invitado funcione bien.

const decode = (token) => {
  try {
    const payload = token.split(".")[1];
    const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(atob(normalized));
  } catch {
    return null;
  }
};

export const clearToken = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("token");
};

// Devuelve el timestamp de expiración (ms) del token, o null si no aplica.
export const getExpiryMs = (token) => {
  if (!token) return null;
  const decoded = decode(token);
  return decoded?.exp ? decoded.exp * 1000 : null;
};

/**
 * Devuelve el token solo si existe y NO está expirado.
 * Si está expirado/corrupto lo limpia y devuelve "".
 */
export const getValidToken = () => {
  const token =
    localStorage.getItem("accessToken") || localStorage.getItem("token") || "";
  if (!token) return "";

  const decoded = decode(token);
  if (decoded?.exp && decoded.exp * 1000 <= Date.now()) {
    clearToken();
    return "";
  }
  return token;
};

export const hasValidToken = () => !!getValidToken();
