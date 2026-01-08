import React from 'react';
import LoginModalContent from '../views/shared/LoginModalContent';
import RegisterModalContent from '../views/shared/RegisterModalContent';

const AuthModal = ({ show, onClose, mode, setMode }) => {
  if (!show) return null;

  const title = mode === 'login' ? 'Iniciar Sesión' : 'Crear Cuenta de Cliente';

  return (
    <>
      {/* Fondo oscuro */}
      <div className="modal-backdrop fade show"></div>

      {/* Modal */}
      <div className="modal fade show d-block" tabIndex="-1" role="dialog">
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content rounded-4 shadow">
            
            {/* Header */}
            <div className="modal-header">
              <h5 className="modal-title fw-bold">{title}</h5>
              <button type="button" className="btn-close" onClick={onClose}></button>
            </div>

            {/* Body */}
            <div className="modal-body">
              {mode === 'login' ? (
                <LoginModalContent
                  onSuccess={onClose}
                  switchToRegister={() => setMode('register')}
                />
              ) : (
                <RegisterModalContent
                  onSuccess={() => {
                    setMode('login'); // cuando se registre lo lleva al login modal
                  }}
                  switchToLogin={() => setMode('login')}
                />
              )}
            </div>

          </div>
        </div>
      </div>
    </>
  );
};

export default AuthModal;
