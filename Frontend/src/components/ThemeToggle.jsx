import React from "react";
import { useTheme } from "../stores/ThemeContext.jsx";

const ThemeToggle = ({ className = "btn btn-outline-dark" }) => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      className={`${className} d-flex align-items-center justify-content-center gap-2`}
      onClick={toggleTheme}
      title={isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
    >
      <i className={`bi ${isDark ? "bi-sun" : "bi-moon-stars"}`}></i>
      <span className="d-none d-sm-inline">{isDark ? "Claro" : "Oscuro"}</span>
    </button>
  );
};

export default ThemeToggle;
