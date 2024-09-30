import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import Axios from "axios";
import "./LoginForm.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { useDispatch } from 'react-redux';
import { setUser } from './UserSlice';

function LoginForm({ setIsLoggedIn, setUserRole }) {
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [idUsuario, setIdUsuario] = useState("");
  const [rol, setRol] = useState("");
  const [loginStatus, setLoginStatus] = useState("");
  const history = useHistory();
  const dispatch = useDispatch();

  const login = (e) => {
    e.preventDefault();
    console.log("Usuario:", usuario, "Password:", password);

    Axios.post("http://localhost:3001/auth/login", {
      usuario: usuario,
      password: password
    })
    .then((response) => {
      console.log("Respuesta del servidor:", response.data);
      console.log("Usuario recibido:", response.data.usuario);

      if (response.data.message) {
        alert(response.data.message);
      } else {  
        setIsLoggedIn(true);
        localStorage.setItem("isLoggedIn", "true");

        // Hacer una solicitud GET para obtener el rol y idUsuario del usuario
        Axios.get(`http://localhost:3001/auth/usuario/${usuario}`)
          .then((response) => {
            const userRole = response.data.body.rol;
            const userId = response.data.body.idUsuario;
            localStorage.setItem("userRole", userRole);
            setUserRole(userRole);

            setIdUsuario(userId);

            const userData = {
              idUsuario: userId,
              usuario: usuario,
              rol: userRole,
            };

            console.log("Este es el usuario que estoy enviando", userData);

            dispatch(setUser(userData));
            history.push("/inicio");
          })
          .catch((error) => {
            console.error("Error al obtener el rol del usuario:", error);
          });
      }
    })
    .catch((error) => {
      console.error("Error de red:", error);
      alert("Contraseña o usuario incorrecto");
    });
  };

  return (
    <div className="loginForm">
      <form onSubmit={login}>
        <h4>Inicio de sesion</h4>
        <label htmlFor="usuario">Usuario:</label>
        <input
          className="textInput"
          type="text"
          name="usuario"
          value={usuario}
          onChange={(e) => setUsuario(e.target.value)}
          placeholder="Ingresa tu usuario"
          required
        />
        <label htmlFor="password">Contraseña:</label>
        <input
          className="textInput"
          type="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Ingresa tu contraseña"
          required
        />
        <input className="button" type="submit" value="Acceder" />
        <h1
          style={{
            color: "red",
            fontSize: "15px",
            textAlign: "center",
            marginTop: "20px",
         
         
          }}
        >
          {loginStatus}
        </h1>
      </form>
    </div>
  );
}

export default LoginForm;