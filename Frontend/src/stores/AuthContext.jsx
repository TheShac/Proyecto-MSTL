import React, {
  createContext,
  useContext,
  useMemo,
  useState,
} from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // === STATE: leemos de localStorage al iniciar ===
  const [token, setToken] = useState(
    () => localStorage.getItem('accessToken') || null
  );
  const [role, setRole] = useState(
    () => localStorage.getItem('role') || null
  );
  const [userType, setUserType] = useState(
    () => localStorage.getItem('userType') || null
  );
  const [id, setId] = useState(
    () => localStorage.getItem('id') || null
  );
  const [username, setUsername] = useState(
    () => localStorage.getItem('username') || null
  );

  // === GETTERS ===
  const isLoggedIn = useMemo(() => !!token, [token]);

  const isAdmin = useMemo(() => {
    if (!role) return false;
    const adminRoles = [
      'stl_administrador',
      'stl_superadministrador',
      'stl_emp',
    ];
    return adminRoles.includes(role);
  }, [role]);

  // === ACTION: login ===
  const login = ({ accessToken, role, userType, id, username }) => {
    setToken(accessToken || null);
    setRole(role || null);
    setUserType(userType || null);
    setId(id || null);
    setUsername(username || null);

    if (accessToken) localStorage.setItem('accessToken', accessToken);
    if (role) localStorage.setItem('role', role);
    if (userType) localStorage.setItem('userType', userType);
    if (id) localStorage.setItem('id', id);
    if (username) localStorage.setItem('username', username);
  };

  // === ACTION: logout ===
  const logout = () => {
    setToken(null);
    setRole(null);
    setUserType(null);
    setId(null);
    setUsername(null);

    localStorage.removeItem('accessToken');
    localStorage.removeItem('role');
    localStorage.removeItem('userType');
    localStorage.removeItem('id');
    localStorage.removeItem('username');
  };

  const value = {
    token,
    role,
    userType,
    id,
    username,
    isLoggedIn,
    isAdmin,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth debe usarse dentro de <AuthProvider>');
  }
  return ctx;
};
