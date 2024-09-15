import React, { useState, useEffect, useRef } from 'react';
import Axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import "./proveedores.css";

const ProveedorView = () => {
  const inputRef = useRef(null);
  const [proveedores, setProveedores] = useState([]);
  const [nuevoProveedor, setNuevoProveedor] = useState({
    nombre: '',
    direccion: '',
    telefono: '',
    idUsuario: ''
  });
  const [proveedorSeleccionado, setProveedorSeleccionado] = useState(null);
  const [proveedorEditado, setProveedorEditado] = useState({
    nombre: '',
    direccion: '',
    telefono: '',
    idUsuario: ''
  });
  const [proveedorBuscado, setProveedorBuscado] = useState([]);
  const [mostrarTodos, setMostrarTodos] = useState(false);
  const [busquedaRealizada, setBusquedaRealizada] = useState(false);

  useEffect(() => {
    if (mostrarTodos) {
      obtenerProveedores();
    }
  }, [mostrarTodos]);

  const sendHandler = async () => {
    const formData = new FormData();
    formData.append('nombre', nuevoProveedor.nombre);
    formData.append('direccion', nuevoProveedor.direccion);
    formData.append('telefono', nuevoProveedor.telefono);
    formData.append('idUsuario', nuevoProveedor.idUsuario);

    try {
      await Axios.post('http://localhost:3001/proveedores', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setNuevoProveedor({ nombre: '', direccion: '', telefono: '', idUsuario: '' });
    } catch (error) {
      console.error('Error al agregar Proveedor:', error);
    }
  };

  const obtenerProveedores = async () => {
    try {
      const response = await Axios.get('http://localhost:3001/proveedores');
      if (Array.isArray(response.data.body)) {
        setProveedores(response.data.body);
      } else {
        console.error('Los datos recibidos no son un array:', response.data);
        setProveedores([]);
      }
    } catch (error) {
      console.error('Error al obtener proveedores:', error);
      setProveedores([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nuevoProveedor.nombre || !nuevoProveedor.direccion || !nuevoProveedor.telefono || !nuevoProveedor.idUsuario) {
      return;
    }
    try {
      await Axios.post('http://localhost:3001/proveedores', nuevoProveedor);
      setNuevoProveedor({ nombre: '', direccion: '', telefono: '', idUsuario: '' });
    } catch (error) {
      console.error('Error al agregar Proveedor:', error);
    }
  };

  const handleInputChange = (e) => {
    setNuevoProveedor({ ...nuevoProveedor, [e.target.name]: e.target.value });
  };

  const handleInputChangeEditado = (e) => {
    setProveedorEditado({ ...proveedorEditado, [e.target.name]: e.target.value });
  };

  const handleEditarProveedor = (proveedor) => {
    setProveedorSeleccionado(proveedor);
    setProveedorEditado(proveedor);
  };

  const handleBuscarProveedor = async () => {
    const valorBuscado = inputRef.current.value;
    try {
      const response = await Axios.get(`http://localhost:3001/proveedores/${valorBuscado}`);
      if (Array.isArray(response.data.body)) {
        setProveedorBuscado(response.data.body);
      } else {
        console.error('Los datos recibidos no son un array:', response.data);
        setProveedorBuscado([]);
      }
      if (mostrarTodos) {
        setMostrarTodos(false);
        setProveedores([]);
      }
      setBusquedaRealizada(true);
    } catch (error) {
      console.error('Error al obtener Proveedores:', error);
      setProveedorBuscado([]);
    }
  };

  const handleActualizarProveedor = async (idProveedor) => {
    if (!proveedorEditado.nombre || !proveedorEditado.direccion || !proveedorEditado.telefono || !proveedorEditado.idUsuario) {
      alert('Por favor, complete todos los campos.');
      return;
    }

    const confirmUpdate = window.confirm('¿Está seguro que desea modificar el proveedor?');
    if (!confirmUpdate) return;

    try {
      const response = await Axios.put(`http://localhost:3001/proveedores/${idProveedor}`, proveedorEditado);
      console.log('Proveedor actualizado:', response.data);
      obtenerProveedores();
    } catch (error) {
      console.error('Error al actualizar proveedor:', error);
    }
  };

  const handleEliminarProveedor = async (idProveedor) => {
    if (!idProveedor) {
      alert('Proveedor no válido para eliminar.');
      return;
    }

    const confirmDelete = window.confirm('¿Está seguro que desea eliminar el proveedor?');
    if (!confirmDelete) return;

    try {
      await Axios.delete(`http://localhost:3001/proveedores/${idProveedor}`);
      obtenerProveedores();
    } catch (error) {
      console.error('Error al eliminar proveedor:', error);
    }
  };

  const handleMostrarTodosLosProveedores = async () => {
    setProveedorBuscado([]);
    if (busquedaRealizada) {
      setBusquedaRealizada(false);
    }
    if (mostrarTodos) {
      setMostrarTodos(false);
      setProveedores([]);
    } else {
      await obtenerProveedores();
      setMostrarTodos(true);
    }
  };

  return (
    <div className="container-fluid">
      <h1 className="text-center">Proveedores</h1>
      <div className="row">
        <div className="col-md-6">
          <form onSubmit={handleSubmit} encType="multipart/form-data">
            <div className="mb-3">
              <input
                type="text"
                name="nombre"
                placeholder="Nombre"
                value={nuevoProveedor.nombre}
                onChange={handleInputChange}
                className="form-control"
              />
            </div>
            <div className="mb-3">
              <input
                type="text"
                name="direccion"
                placeholder="Dirección"
                value={nuevoProveedor.direccion}
                onChange={handleInputChange}
                className="form-control"
              />
            </div>
            <div className="mb-3">
              <input
                type="text"
                name="telefono"
                placeholder="Teléfono"
                value={nuevoProveedor.telefono}
                onChange={handleInputChange}
                className="form-control"
              />
            </div>
            <div className="mb-3">
              <input
                type="text"
                name="idUsuario"
                placeholder="ID Usuario"
                value={nuevoProveedor.idUsuario}
                onChange={handleInputChange}
                className="form-control"
              />
            </div>
            <div className="mb-3">
              <button className="btn btn-primary" onClick={sendHandler}>Agregar Proveedor</button>
            </div>
          </form>
        </div>
        <div className="col-md-6">
          <form className="mb-3">
            <div className="mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Nombre del proveedor"
                ref={inputRef}
              />
            </div>
            <div className="mb-3">
              <button type="button" className="btn btn-primary" onClick={handleBuscarProveedor}>Buscar</button>
            </div>
          </form>
        </div>
      </div>
      <div className="row">
        <div className="col-md-12">
          <button className="btn btn-primary" onClick={handleMostrarTodosLosProveedores}>
            {mostrarTodos ? 'Ocultar Todos los Proveedores' : (busquedaRealizada ? 'Mostrar Todos los Proveedores' : 'Mostrar Todos los Proveedores')}
          </button>
        </div>
      </div>
      <div className="row">
        {proveedores.map((proveedor) => (
          <div key={proveedor.idProveedor} className="col-md-4 col-sm-6">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Nombre: {proveedor.nombre}</h5>
                <p className="card-text">Dirección: {proveedor.direccion}</p>
                <p className="card-text">Teléfono: {proveedor.telefono}</p>
                <p className="card-text">ID Usuario: {proveedor.idUsuario}</p>
                <button className="btn btn-primary" onClick={() => handleEditarProveedor(proveedor)}>Editar</button>
                <button className="btn btn-danger" onClick={() => handleEliminarProveedor(proveedor.idProveedor)}>Eliminar</button>
                {proveedor === proveedorSeleccionado && (
                  <div>
                    <input
                      type="text"
                      name="nombre"
                      value={proveedorEditado.nombre}
                      onChange={handleInputChangeEditado}
                      className="form-control"
                    />
                    <input
                      type="text"
                      name="direccion"
                      value={proveedorEditado.direccion}
                      onChange={handleInputChangeEditado}
                      className="form-control"
                    />
                    <input
                      type="text"
                      name="telefono"
                      value={proveedorEditado.telefono}
                      onChange={handleInputChangeEditado}
                      className="form-control"
                    />
                    <input
                      type="text"
                      name="idUsuario"
                      value={proveedorEditado.idUsuario}
                      onChange={handleInputChangeEditado}
                      className="form-control"
                    />
                    <button className="btn btn-success" onClick={() => handleActualizarProveedor(proveedor.idProveedor)}>Actualizar</button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="row">
        {Array.isArray(proveedorBuscado) && proveedorBuscado.map((proveedorB) => (
          <div key={proveedorB.idProveedor} className="col-md-4 col-sm-6">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Nombre: {proveedorB.nombre}</h5>
                <p className="card-text">Dirección: {proveedorB.direccion}</p>
                <p className="card-text">Teléfono: {proveedorB.telefono}</p>
                <p className="card-text">ID Usuario: {proveedorB.idUsuario}</p>
                <button className="btn btn-primary" onClick={() => handleEditarProveedor(proveedorB)}>Editar</button>
                <button className="btn btn-danger" onClick={() => handleEliminarProveedor(proveedorB.idProveedor)}>Eliminar</button>
                {proveedorB === proveedorSeleccionado && (
                  <div>
                    <input
                      type="text"
                      name="nombre"
                      value={proveedorEditado.nombre}
                      onChange={handleInputChangeEditado}
                      className="form-control"
                    />
                    <input
                      type="text"
                      name="direccion"
                      value={proveedorEditado.direccion}
                      onChange={handleInputChangeEditado}
                      className="form-control"
                    />
                    <input
                      type="text"
                      name="telefono"
                      value={proveedorEditado.telefono}
                      onChange={handleInputChangeEditado}
                      className="form-control"
                    />
                    <input
                      type="text"
                      name="idUsuario"
                      value={proveedorEditado.idUsuario}
                      onChange={handleInputChangeEditado}
                      className="form-control"
                    />
                    <button className="btn btn-success" onClick={() => handleActualizarProveedor(proveedorB.idProveedor)}>Actualizar</button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProveedorView;
