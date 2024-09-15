import React, { useState } from "react";
import Axios from "axios";
import "./RegisterForm.css";
import "bootstrap/dist/css/bootstrap.min.css"; // Estilos de Bootstrap

function RegisterForm() {
  const [nombre, setNombre] = useState("");
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [rol, setRol] = useState("admin");
  const [registerStatus, setRegisterStatus] = useState("");
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!nombre) newErrors.nombre = "Nombre es requerido";
    if (!usuario) newErrors.usuario = "Usuario es requerido";
    if (!password) newErrors.password = "Contraseña es requerida";
    else if (password.length < 8) newErrors.password = "La contraseña debe tener al menos 8 caracteres";
    if (password !== confirmPassword) newErrors.confirmPassword = "Las contraseñas no coinciden";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const register = async (e) => {
    e.preventDefault();
    
    if (validate()) {
      try {
        const response = await Axios.post("http://localhost:3001/usuarios", {
          nombre,
          usuario,
          password,
          rol
        });

        if (response.data.message) {
          setRegisterStatus(response.data.message);
        } else {
          setRegisterStatus("CUENTA CREADA CON ÉXITO");
        }
      } catch (error) {
        console.error("Error en la solicitud:", error.response ? error.response.data : error.message);
        setRegisterStatus("EL USUARIO YA EXISTE");
      }
    }
  };

  return (
    <div className="loginForm">
  
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
          {errors.nombre && <span className="text-danger">{errors.nombre}</span>}
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
          {errors.usuario && <span className="text-danger">{errors.usuario}</span>}
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
          {errors.password && <span className="text-danger">{errors.password}</span>}
        </div>
        <div className="mb-3">
          <label htmlFor="confirmPassword">Confirmar Contraseña:</label>
          <input
            type="password"
            className="textInput"
            name="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirmar Contraseña"
            required
          />
          {errors.confirmPassword && <span className="text-danger">{errors.confirmPassword}</span>}
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
