import React, { useState } from "react";
import Axios from "axios";
import "./RegisterForm.css";
import "bootstrap/dist/css/bootstrap.min.css"; // Estilos de Bootstrap

function RegisterForm() {
  const [nombre, setNombre] = useState("");
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [rol, setRol] = useState("admin");
  const [registerStatus, setRegisterStatus] = useState("");

  const register = (e) => {
    e.preventDefault();
    Axios.post("http://localhost:3001/usuarios", {
      nombre: nombre,
      usuario: usuario,
      password: password,
      rol: rol
    }).then((response) => {
      if (response.data.message) {
        setRegisterStatus(response.data.message);
      } else {
        setRegisterStatus("CUENTA CREADA CON ÉXITO");
      }
    });
  };

  return (
    <div className="loginForm">
      <img src="/Logo.png" alt="Logo" className="logo" />
      <form>
        <h4>Registro de cuenta</h4>
        <div className="mb-3">
          <label htmlFor="nombre">Nombre:</label>
          <input
            type="text"
            className="textInput"
            name="nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Nombre"
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="usuario">Usuario:</label>
          <input
            type="text"
            className="textInput"
            name="usuario"
            value={usuario}
            onChange={(e) => setUsuario(e.target.value)}
            placeholder="Usuario"
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="password">Contraseña:</label>
          <input
            type="password"
            className="textInput"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Contraseña"
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="rol">Rol:</label>
          <select
            className="textInput"
            name="rol"
            value={rol}
            onChange={(e) => setRol(e.target.value)}
            required
          >
            <option value="admin">Admin</option>
            <option value="vendedor">Vendedor</option>
          </select>
        </div>
        <button className="button" onClick={register}>
          Inscribirse
        </button>
        <h1
          style={{
            fontSize: "15px",
            textAlign: "center",
            marginTop: "20px"
          }}
        >
          {registerStatus}
        </h1>
      </form>
      <p className="text-center">¿Ya tienes una cuenta?
        <a href="/auth/login" className="text-info">Acceso</a>
      </p>
    </div>
  );
}

export default RegisterForm;