import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../stores/AuthContext';
import SidebarMenu from './SidebarMenu';
import AuthModal from './AuthModal';
import ThemeToggle from '../components/ThemeToggle';
import './Styles/Navbar.css';

const Navbar = () => {
  const auth = useAuth();
  const navigate = useNavigate();

  const [menuAbierto, setMenuAbierto] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [cartCount] = useState(0);

  const [showAuthModal, setShowAuthModal] = useState(false);
  const [mode, setMode] = useState('login');

  const dropdownRef = useRef(null);

  const toggleMenu = () => setMenuAbierto((prev) => !prev);
  const toggleDropdown = () => setDropdownOpen((prev) => !prev);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const cerrarSesion = () => {
    auth.logout();
    setDropdownOpen(false);
    navigate('/', { replace: true });
  };

  const openLoginModal = () => {
    setMode('login');
    setShowAuthModal(true);
  };

  const openRegisterModal = () => {
    setMode('register');
    setShowAuthModal(true);
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-light shadow-sm px-4 py-2">
        <div className="container-fluid">
          <Link
            to="/"
            className="navbar-brand fw-bold text-dark d-flex align-items-center gap-2"
            style={{ overflow: "visible" }}
          >
            <img
              src="/logo.png"
              alt="Logo Manga Store TL"
              style={{
                width: "100px",
                height: "100px",
                objectFit: "contain",
                display: "block",
              }}
            />
            <span className="fw-bold text-dark fs-4 mb-0">Manga Store TL</span>
          </Link>

          <div className="ms-auto d-flex align-items-center gap-3">
            {/* ✅ MODO OSCURO/CLARO */}
            <ThemeToggle />

            <button className="btn btn-outline-dark" onClick={toggleMenu}>
              <i className="bi bi-list"></i> Menú
            </button>

            <Link to="/carrito" className="btn btn-outline-dark position-relative">
              <i className="bi bi-cart"></i>
              {cartCount > 0 && (
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                  {cartCount}
                </span>
              )}
            </Link>

            {!auth.isLoggedIn ? (
              <>
                <button onClick={openLoginModal} className="btn btn-outline-dark">
                  Iniciar sesión
                </button>
                <button onClick={openRegisterModal} className="btn btn-dark text-white">
                  Registrar
                </button>
              </>
            ) : (
              <div className="position-relative" ref={dropdownRef}>
                <button
                  className="btn btn-outline-dark d-flex align-items-center gap-2 px-3"
                  onClick={toggleDropdown}
                >
                  <i className="bi bi-person-circle fs-5"></i>
                  <span className="fw-semibold">Mi cuenta</span>
                  <i className="bi bi-chevron-down small"></i>
                </button>

                {dropdownOpen && (
                  <div className="dropdown-custom-menu">
                    <Link
                      className="dropdown-custom-item"
                      to="/mis-pedidos"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <i className="bi bi-bag-check"></i> Mis pedidos
                    </Link>

                    <Link
                      className="dropdown-custom-item"
                      to="/profile"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <i className="bi bi-person"></i> Mi perfil
                    </Link>

                    <div className="dropdown-custom-divider"></div>

                    <button
                      type="button"
                      className="dropdown-custom-item text-danger"
                      onClick={cerrarSesion}
                    >
                      <i className="bi bi-box-arrow-right"></i> Cerrar sesión
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <SidebarMenu open={menuAbierto} onClose={() => setMenuAbierto(false)} />
      </nav>

      <AuthModal
        show={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        mode={mode}
        setMode={setMode}
      />
    </>
  );
};

export default Navbar;
