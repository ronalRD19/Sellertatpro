import React from 'react';
import { Link, useHistory } from 'react-router-dom';
import './nav.css';
import "bootstrap/dist/css/bootstrap.min.css";

function Navbar({ isLoggedIn, onLogout, userRole }) {
  const history = useHistory();

  const handleLogout = () => {
    onLogout();
    history.push("/home"); // Redirige al usuario a la página de inicio después de cerrar sesión
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ml-auto">
            {isLoggedIn ? (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/inicio">Inicio</Link>
                </li>
                {userRole === 'admin' && (
                  <>
                    <li className="nav-item">
                      <Link className="nav-link" to="/usuariosForm">Usuarios</Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link" to="/ventas">Ventas</Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link" to="/clientes">Clientes</Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link" to="/productos">Productos</Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link" to="/proveedores">Proveedores</Link>
                    </li>
                  </>
                )}
                {userRole === 'vendedor' && (
                  <>
                    <li className="nav-item">
                      <Link className="nav-link" to="/ventas">Ventas</Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link" to="/clientes">Clientes</Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link" to="/productos">Productos</Link>
                    </li>
                  </>
                )}
                <li className="nav-item">
                  <button className="nav-link" onClick={handleLogout}>Cerrar Sesión</button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/home">Inicio</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/about">Acerca de</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/auth">Iniciar Sesión</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/usuarios">Registrarse</Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;