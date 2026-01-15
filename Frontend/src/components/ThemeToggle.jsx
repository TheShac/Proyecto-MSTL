import React from "react";
import { useTheme } from "../stores/ThemeContext.jsx";

const ThemeToggle = () => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      className="btn btn-outline-dark d-flex align-items-center gap-2"
      onClick={toggleTheme}
      title={isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
    >
      <i className={`bi ${isDark ? "bi-sun" : "bi-moon-stars"}`}></i>
      <span className="d-none d-sm-inline">{isDark ? "Claro" : "Oscuro"}</span>
    </button>
  );
};

export default ThemeToggle;
