import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../../stores/AuthContext";

// ✅ Función para decodificar JWT sin librerías
function decodeJWT(token) {
  try {
    const payload = token.split(".")[1];
    const decoded = JSON.parse(atob(payload));
    return decoded;
  } catch {
    return null;
  }
}

export default function GoogleSuccess() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const auth = useAuth();

  useEffect(() => {
    const token = params.get("token");

    if (!token) {
      navigate("/login", { replace: true });
      return;
    }

    const decoded = decodeJWT(token);

    if (!decoded) {
      navigate("/login", { replace: true });
      return;
    }

    const { role, userType, id, username } = decoded;

    // ✅ Guardar en AuthContext
    auth.login({
      accessToken: token,
      role,
      userType,
      id,
      username,
    });

    // ✅ Guardar en localStorage igual que login normal
    localStorage.setItem("accessToken", token);
    localStorage.setItem("role", role);
    localStorage.setItem("userType", userType);

    // ✅ Redirección según tu misma lógica
    if (userType === "employee") {
      const adminRoles = ["stl_administrador", "stl_superadministrador", "stl_emp"];
      if (adminRoles.includes(role)) {
        navigate("/admin/dashboard", { replace: true });
      } else {
        navigate("/", { replace: true });
      }
    } else {
      navigate("/", { replace: true });
    }
  }, []);

  return (
    <div className="d-flex align-items-center justify-content-center vh-100 bg-light">
      <p className="fw-bold text-secondary">Iniciando sesión con Google...</p>
    </div>
  );
}
