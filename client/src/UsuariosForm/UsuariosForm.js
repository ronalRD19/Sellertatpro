import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import "./UsuariosForm.css";

const UsuariosView = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingUsuario, setEditingUsuario] = useState(null);
  const [editedUsuario, setEditedUsuario] = useState('');
  const [editedRol, setEditedRol] = useState('');

  useEffect(() => {
    obtenerUsuarios();
  }, []);

  const obtenerUsuarios = async () => {
    try {
      const response = await Axios.get('http://localhost:3001/auth');
      const usuariosData = response.data.body;
      setUsuarios(usuariosData);
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
    }
  };

  const handleEliminar = async (usuario) => {
    try {
      await Axios.delete(`http://localhost:3001/auth/usuario/nombre/${usuario}`);
      obtenerUsuarios(); // Refrescar la lista de usuarios
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
    }
  };

  const handleEditar = (usuario) => {
    setEditingUsuario(usuario.usuario);
    setEditedUsuario(usuario.usuario);
    setEditedRol(usuario.rol);
  };

  const handleGuardarEdicion = async () => {
    try {
      await Axios.put(`http://localhost:3001/auth/usuario/nombre/${editingUsuario}`, {
        usuario: editedUsuario,
        rol: editedRol,
      });
      setEditingUsuario(null);
      obtenerUsuarios(); // Refrescar la lista de usuarios
    } catch (error) {
      console.error('Error al actualizar usuario:', error);
    }
  };

  // Función para filtrar usuarios por nombre
  const filteredUsuarios = usuarios.filter(usuario => {
    return usuario.usuario.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="usuarios-view-container">
      <h1 className="usuarios-view-header">Usuarios</h1>
      <hr />
      <div className="search-container">
        <input
          type="text"
          placeholder="Buscar usuario"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="input-text"
        />
      </div>
      <ul className="usuarios-view-list">
        {filteredUsuarios.map((usuario) => (
          <li key={usuario.idUsuario} className="usuarios-view-list-item">
            {editingUsuario === usuario.usuario ? (
              <div className="edit-form">
                <input
                  type="text"
                  value={editedUsuario}
                  onChange={(e) => setEditedUsuario(e.target.value)}
                  className="input-text"
                />
                <select
                  value={editedRol}
                  onChange={(e) => setEditedRol(e.target.value)}
                  className="input-text"
                >
                  <option value="admin">admin</option>
                  <option value="vendedor">vendedor</option>
                </select>
                <button onClick={handleGuardarEdicion} className="save-button">Guardar</button>
                <button onClick={() => setEditingUsuario(null)} className="cancel-button">Cancelar</button>
              </div>
            ) : (
              <div className="usuario-info">
                <div><strong>Usuario:</strong> {usuario.usuario}</div>
                <div><strong>Rol:</strong> {usuario.rol}</div>
                <button onClick={() => handleEditar(usuario)} className="edit-button">Editar</button>
                <button onClick={() => handleEliminar(usuario.usuario)} className="delete-button">Eliminar</button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UsuariosView;