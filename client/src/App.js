import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import HomePage from "./home/HomePage";
import AboutPage from "./home/AboutPage";
import Navbar from './nav/Navbar';
import WelcomeView from './inicio/inicio';
import LoginForm from "./login_registro/LoginForm";
import RegisterForm from "./login_registro/RegisterForm";
import ClienteView from "./clientes/clientes";
import ProductoView from "./productos/productos";
import VentasView from "./ventas/ventas";
import ProveedoresView from "./proveedores/proveedores";
import UsuariosView from "./UsuariosForm/UsuariosForm";
import './styles.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState('');

  useEffect(() => {
    const loggedInStatus = localStorage.getItem('isLoggedIn');
    const role = localStorage.getItem('userRole');
    if (loggedInStatus && loggedInStatus === 'true') {
      setIsLoggedIn(true);
      setUserRole(role);
    }
  }, []);

  // Al recargar la página, ejecutar la función de logout
  useEffect(() => {
    logout();
  }, []);

  const logout = () => {
    setIsLoggedIn(false);
    setUserRole('');
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userRole');
  };

  // Componente de ruta privada para restringir el acceso a ciertas rutas si no está autenticado
  const PrivateRoute = ({ component: Component, allowedRoles, ...rest }) => (
    <Route {...rest} render={(props) => (
      isLoggedIn && allowedRoles.includes(userRole)
        ? <Component {...props} />
        : <Redirect to='/auth' />
    )} />
  );

  return (
    <Router>
      <div>
        <Navbar isLoggedIn={isLoggedIn} onLogout={logout} userRole={userRole} />
        <Switch>
          <Route path="/inicio">
            {isLoggedIn ? <WelcomeView/> : <Redirect to="/auth" />}
          </Route>
          <Route path="/about">
            <AboutPage />
          </Route>
          <Route path="/auth">
            <LoginForm setIsLoggedIn={setIsLoggedIn} setUserRole={setUserRole} />
          </Route>
          <Route path="/usuarios">
            <RegisterForm />
          </Route>
          <PrivateRoute path="/ventas" component={VentasView} allowedRoles={['admin', 'vendedor']} />
          <PrivateRoute path="/clientes" component={ClienteView} allowedRoles={['admin', 'vendedor']} />
          <PrivateRoute path="/productos" component={ProductoView} allowedRoles={['admin', 'vendedor']} />
          <PrivateRoute path="/proveedores" component={ProveedoresView} allowedRoles={['admin']} />
          <PrivateRoute path="/UsuariosForm" component={UsuariosView} allowedRoles={['admin']} />
          <Route path="/">
            <HomePage  />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;