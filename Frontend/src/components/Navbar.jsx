import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../stores/AuthContext';
import SidebarMenu from './SidebarMenu';
import AuthModal from './AuthModal';
import './Styles/Navbar.css';

const Navbar = () => {
  const auth = useAuth();
  const navigate = useNavigate();

  const [menuAbierto, setMenuAbierto] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [cartCount] = useState(0);

  // ✅ modal
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [mode, setMode] = useState('login'); // login | register

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
      <nav className="navbar navbar-expand-lg navbar-light bg-light shadow-sm px-4">
        <div className="container-fluid">
          <Link to="/" className="navbar-brand fw-bold text-dark">
            Don Mangas
          </Link>

          <div className="ms-auto d-flex align-items-center gap-3">
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
                {/* ✅ ahora abre modal */}
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
                  className="btn btn-outline-dark d-flex align-items-center"
                  onClick={toggleDropdown}
                >
                  <i className="bi bi-person-circle me-1"></i>
                  Mi cuenta
                </button>

                {dropdownOpen && (
                  <div className="dropdown-menu-custom">
                    <Link className="dropdown-item" to="/mis-pedidos">
                      Mis pedidos
                    </Link>
                    <Link className="dropdown-item" to="/profile">
                      Mi perfil
                    </Link>
                    <hr className="dropdown-divider" />
                    <button
                      type="button"
                      className="dropdown-item text-danger"
                      onClick={cerrarSesion}
                    >
                      Cerrar sesión
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <SidebarMenu open={menuAbierto} onClose={() => setMenuAbierto(false)} />
      </nav>

      {/* ✅ Modal de Auth */}
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
