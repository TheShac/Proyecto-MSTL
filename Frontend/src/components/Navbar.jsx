import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../stores/AuthContext';
import { useCart } from '../stores/CartContext';
import { useWishlist } from '../stores/WishlistContext';
import SidebarMenu from './SidebarMenu';
import AuthModal from './AuthModal';
import ThemeToggle from '../components/ThemeToggle';
import './Styles/Navbar.css';

const Navbar = () => {
  const auth = useAuth();
  const navigate = useNavigate();
  const { count: cartCount, openCart } = useCart();
  const wishlist = useWishlist();

  const [menuAbierto, setMenuAbierto] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const dropdownRef = useRef(null);

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

  const openLoginModal = () => setShowAuthModal(true);

  const handleSearch = (e) => {
    e.preventDefault();
    const q = searchTerm.trim();
    navigate(q ? `/catalogo?search=${encodeURIComponent(q)}` : '/catalogo');
  };

  // Si hay sesión navega; si no, abre el modal de login/registro.
  const goAuthed = (to) => {
    if (auth.isLoggedIn) navigate(to);
    else openLoginModal();
  };

  const linkClass = ({ isActive }) =>
    `secondary-nav__link ${isActive ? 'active' : ''}`;

  return (
    <>
      <header className="app-navbar">
        {/* ── Fila superior: logo + buscador + acciones ─────────────────── */}
        <div className="app-navbar__top">
          <Link to="/" className="app-navbar__brand text-decoration-none">
            <img src="/logo.png" alt="Manga Store TL" className="app-navbar__logo" />
            <span className="fw-bold fs-5 d-none d-sm-inline">Manga Store TL</span>
          </Link>

          {/* Buscador */}
          <form className="app-navbar__search" onSubmit={handleSearch} role="search">
            <i className="bi bi-search" />
            <input
              type="search"
              placeholder="Busca mangas, tomos, autores o géneros..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              aria-label="Buscar"
            />
          </form>

          {/* Acciones derecha (carrito y menú se quedan aquí) */}
          <div className="app-navbar__actions">
            <ThemeToggle />

            <button className="btn btn-outline-dark" onClick={() => setMenuAbierto(true)}>
              <i className="bi bi-list" />
              <span className="d-none d-lg-inline ms-1">Menú</span>
            </button>

            {wishlist.isCustomer && (
              <button
                type="button"
                className="btn btn-outline-dark position-relative"
                onClick={() => navigate('/profile?tab=favorites')}
                aria-label="Favoritos"
              >
                <i className="bi bi-heart" />
                {wishlist.count > 0 && (
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                    {wishlist.count}
                  </span>
                )}
              </button>
            )}

            <button
              type="button"
              className="btn btn-outline-dark position-relative"
              onClick={openCart}
              aria-label="Carrito"
            >
              <i className="bi bi-cart" />
              {cartCount > 0 && (
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                  {cartCount}
                </span>
              )}
            </button>

            {auth.isLoggedIn && (
              <div className="position-relative" ref={dropdownRef}>
                <button
                  className="btn btn-outline-dark d-flex align-items-center gap-1"
                  onClick={() => setDropdownOpen((v) => !v)}
                  aria-label="Mi cuenta"
                >
                  <i className="bi bi-person-circle fs-5" />
                  <i className="bi bi-chevron-down small" />
                </button>

                {dropdownOpen && (
                  <div className="dropdown-custom-menu">
                    <Link className="dropdown-custom-item" to="/mis-pedidos" onClick={() => setDropdownOpen(false)}>
                      <i className="bi bi-bag-check" /> Mis pedidos
                    </Link>
                    <Link className="dropdown-custom-item" to="/profile" onClick={() => setDropdownOpen(false)}>
                      <i className="bi bi-person" /> Mi perfil
                    </Link>
                    <div className="dropdown-custom-divider" />
                    <button type="button" className="dropdown-custom-item text-danger" onClick={cerrarSesion}>
                      <i className="bi bi-box-arrow-right" /> Cerrar sesión
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* ── Fila secundaria: navegación ───────────────────────────────── */}
        <nav className="secondary-nav">
          <NavLink to="/" className={linkClass} end>
            Inicio
          </NavLink>
          <NavLink to="/catalogo" className={linkClass}>
            Catálogo
          </NavLink>
          <button type="button" className="secondary-nav__link" onClick={() => goAuthed('/profile')}>
            Mi cuenta
          </button>
          <NavLink to="/seguimiento" className={linkClass}>
            Seguimiento
          </NavLink>
          <button
            type="button"
            className="secondary-nav__link"
            onClick={() => (auth.isLoggedIn ? navigate('/profile?tab=favorites') : openLoginModal())}
          >
            Wishlist
          </button>
        </nav>
      </header>

      <SidebarMenu open={menuAbierto} onClose={() => setMenuAbierto(false)} />

      <AuthModal show={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </>
  );
};

export default Navbar;
