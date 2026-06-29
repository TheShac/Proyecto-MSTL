import React from 'react';
import LoginModalContent from '../views/shared/LoginModalContent';
import RegisterModalContent from '../views/shared/RegisterModalContent';
import './Styles/AuthModal.css';

const AuthModal = ({ show, onClose }) => {
  if (!show) return null;

  return (
    <>
      <div className="modal-backdrop fade show" onClick={onClose}></div>

      <div className="modal fade show d-block auth-modal" tabIndex="-1" role="dialog">
        <div className="modal-dialog modal-lg modal-dialog-centered" role="document">
          <div className="modal-content position-relative">
            <button
              type="button"
              className="btn-close auth-modal__close"
              onClick={onClose}
              aria-label="Cerrar"
            />

            {/* Cabecera con acento de marca */}
            <div className="auth-modal__header">
              <img src="/logo.png" alt="" className="auth-modal__logo" />
              <div>
                <h5 className="m-0 fw-bold">Bienvenido a Manga Store TL</h5>
                <small>Inicia sesión o crea tu cuenta para comprar más rápido.</small>
              </div>
            </div>

            <div className="modal-body p-0">
              <div className="row g-0">
                {/* Registro */}
                <div className="col-md-6 auth-pane auth-pane--register">
                  <div className="auth-pane__title">
                    <i className="bi bi-person-plus" />
                    <h4 className="fw-bold m-0">Crear cuenta</h4>
                  </div>
                  <p className="text-muted small mb-4">
                    Regístrate para seguir tus pedidos y comprar más rápido.
                  </p>
                  <RegisterModalContent
                    hideSwitch
                    onSuccess={() => {}}
                    switchToLogin={() => {}}
                  />
                </div>

                {/* Login */}
                <div className="col-md-6 auth-pane auth-pane--login">
                  <div className="auth-pane__title">
                    <i className="bi bi-box-arrow-in-right" />
                    <h4 className="fw-bold m-0">Iniciar sesión</h4>
                  </div>
                  <p className="text-muted small mb-4">
                    ¿Ya tienes cuenta? Ingresa con tus credenciales.
                  </p>
                  <LoginModalContent
                    hideSwitch
                    onSuccess={onClose}
                    switchToRegister={() => {}}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AuthModal;
