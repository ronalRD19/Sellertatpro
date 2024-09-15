import React, { useState, useEffect, useRef } from 'react';
import Axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import "./clientes.css";

const ClienteView = () => {
  const inputRef = useRef(null);
  const [clientes, setClientes] = useState([]);
  const [nuevoCliente, setNuevoCliente] = useState({
    nombre: '',
    direccion: '',
    telefono: '',
    cedula: '',
  });
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
  const [clienteEditado, setClienteEditado] = useState({
    nombre: '',
    direccion: '',
    telefono: '',
  });
  const [clienteBuscado, setClienteBuscado] = useState([]);
  const [mostrarTodos, setMostrarTodos] = useState(false);
  const [busquedaRealizada, setBusquedaRealizada] = useState(false);

  useEffect(() => {
    if (mostrarTodos) {
      obtenerClientes();
    }
  }, [mostrarTodos]);

  const obtenerClientes = async () => {
    try {
      const response = await Axios.get('http://localhost:3001/clientes');
      if (Array.isArray(response.data.body)) {
        setClientes(response.data.body);
      } else {
        console.error('Los datos recibidos no son un array:', response.data);
        setClientes([]);
      }
    } catch (error) {
      console.error('Error al obtener Clientes:', error);
      setClientes([]);
    }
  };

  const sendHandler = async () => {
    try {
      await Axios.post('http://localhost:3001/clientes', nuevoCliente);
      setNuevoCliente({ nombre: '', direccion: '', telefono: '', cedula: '' });
      obtenerClientes();
    } catch (error) {
      if (error.response && error.response.status === 400) {
        alert('El cliente ya existe en la base de datos.');
      } else {
        console.error('Error al agregar cliente:', error);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nuevoCliente.nombre || !nuevoCliente.direccion || !nuevoCliente.telefono || !nuevoCliente.cedula) {
      alert('Por favor, complete todos los campos.');
      return;
    }
    if (window.confirm('¿Estás seguro de que deseas agregar este cliente?')) {
      sendHandler();
    }
  };

  const handleInputChange = (e) => {
    setNuevoCliente({ ...nuevoCliente, [e.target.name]: e.target.value });
  };

  const handleInputChangeEditado = (e) => {
    setClienteEditado({ ...clienteEditado, [e.target.name]: e.target.value });
  };

  const handleEditarCliente = (cliente) => {
    setClienteSeleccionado(cliente);
    setClienteEditado({
      nombre: cliente.nombre,
      direccion: cliente.direccion,
      telefono: cliente.telefono,
    });
  };

  const handleBuscarCliente = async () => {
    const valorBuscado = inputRef.current.value;
    try {
      const response = await Axios.get(`http://localhost:3001/clientes/${valorBuscado}`);
      if (Array.isArray(response.data.body)) {
        setClienteBuscado(response.data.body);
      } else {
        console.error('Los datos recibidos no son un array:', response.data);
        setClienteBuscado([]);
      }
      if (mostrarTodos) {
        setMostrarTodos(false);
        setClientes([]);
      }
      setBusquedaRealizada(true);
    } catch (error) {
      console.error('Error al obtener clientes:', error);
      setClienteBuscado([]);
    }
  };

  const handleActualizarCliente = async (idCliente) => {
    // Validaciones simples
    if (!clienteEditado.nombre || !clienteEditado.direccion || !clienteEditado.telefono) {
      alert('Por favor, complete todos los campos.');
      return;
    }

    // Confirmación antes de actualizar
    if (!window.confirm('¿Estás seguro de que deseas actualizar este cliente?')) {
      return;
    }

    try {
      await Axios.put(`http://localhost:3001/clientes/${idCliente}`, clienteEditado);
      setClienteSeleccionado(null);
      obtenerClientes();
    } catch (error) {
      console.error('Error al actualizar cliente:', error);
    }
  };

  const handleEliminarCliente = async (idCliente) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este cliente?')) {
      try {
        await Axios.delete(`http://localhost:3001/clientes/${idCliente}`);
        obtenerClientes();
      } catch (error) {
        console.error('Error al eliminar cliente:', error);
      }
    }
  };

  const handleMostrarTodosLosClientes = async () => {
    setClienteBuscado([]);
    setBusquedaRealizada(false);
    if (mostrarTodos) {
      setMostrarTodos(false);
      setClientes([]);
    } else {
      await obtenerClientes();
      setMostrarTodos(true);
    }
  };

  return (
    <div className="container-fluid">
      <h1 className="text-center">Clientes</h1>
      <div className="row">
        <div className="col-md-6">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <input
                type="text"
                name="nombre"
                placeholder="Nombre"
                value={nuevoCliente.nombre}
                onChange={handleInputChange}
                className="form-control"
              />
            </div>
            <div className="mb-3">
              <input
                type="text"
                name="direccion"
                placeholder="Direccion"
                value={nuevoCliente.direccion}
                onChange={handleInputChange}
                className="form-control"
              />
            </div>
            <div className="mb-3">
              <input
                type="text"
                name="telefono"
                placeholder="Telefono"
                value={nuevoCliente.telefono}
                onChange={handleInputChange}
                className="form-control"
              />
            </div>
            <div className="mb-3">
              <input
                type="text"
                name="cedula"
                placeholder="Cedula"
                value={nuevoCliente.cedula}
                onChange={handleInputChange}
                className="form-control"
              />
            </div>
            <div className="mb-3">
              <button className="btn btn-primary" type="submit">Agregar Cliente</button>
            </div>
          </form>
        </div>
        <div className="col-md-6">
          <form className="mb-3">
            <div className="mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Nombre del cliente"
                ref={inputRef}
              />
            </div>
            <div className="mb-3">
              <button type="button" className="btn btn-primary" onClick={handleBuscarCliente}>Buscar</button>
            </div>
          </form>
        </div>
      </div>
      <div className="row">
        <div className="col-md-12">
          <button className="btn btn-primary" onClick={handleMostrarTodosLosClientes}>
            {mostrarTodos ? 'Ocultar Todos los Clientes' : 'Mostrar Todos los Clientes'}
          </button>
        </div>
      </div>
      <div className="row">
        {clientes.map((cliente) => (
          <div key={cliente.idCliente} className="col-md-4 col-sm-6">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Nombre: {cliente.nombre}</h5>
                <p className="card-text">Direccion: {cliente.direccion}</p>
                <p className="card-text">Telefono: {cliente.telefono}</p>
                <p className="card-text">Cedula: {cliente.cedula}</p>
                <button className="btn btn-primary" onClick={() => handleEditarCliente(cliente)}>Editar</button>
                <button className="btn btn-danger" onClick={() => handleEliminarCliente(cliente.idCliente)}>Eliminar</button>
                {cliente === clienteSeleccionado && (
                  <div>
                    <input
                      type="text"
                      name="nombre"
                      value={clienteEditado.nombre}
                      onChange={handleInputChangeEditado}
                      className="form-control"
                    />
                    <input
                      type="text"
                      name="direccion"
                      value={clienteEditado.direccion}
                      onChange={handleInputChangeEditado}
                      className="form-control"
                    />
                    <input
                      type="text"
                      name="telefono"
                      value={clienteEditado.telefono}
                      onChange={handleInputChangeEditado}
                      className="form-control"
                    />
                    <button className="btn btn-success" onClick={() => handleActualizarCliente(cliente.idCliente)}>Actualizar</button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="row">
        {Array.isArray(clienteBuscado) && clienteBuscado.map((clienteB) => (
          <div key={clienteB.idCliente} className="col-md-4 col-sm-6">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Nombre: {clienteB.nombre}</h5>
                <p className="card-text">Direccion: {clienteB.direccion}</p>
                <p className="card-text">Telefono: {clienteB.telefono}</p>
                <p className="card-text">Cedula: {clienteB.cedula}</p>
                <button className="btn btn-primary" onClick={() => handleEditarCliente(clienteB)}>Editar</button>
                <button className="btn btn-danger" onClick={() => handleEliminarCliente(clienteB.idCliente)}>Eliminar</button>
                {clienteB === clienteSeleccionado && (
                  <div>
                    <input
                      type="text"
                      name="nombre"
                      value={clienteEditado.nombre}
                      onChange={handleInputChangeEditado}
                      className="form-control"
                    />
                    <input
                      type="text"
                      name="direccion"
                      value={clienteEditado.direccion}
                      onChange={handleInputChangeEditado}
                      className="form-control"
                    />
                    <input
                      type="text"
                      name="telefono"
                      value={clienteEditado.telefono}
                      onChange={handleInputChangeEditado}
                      className="form-control"
                    />
                    <button className="btn btn-success" onClick={() => handleActualizarCliente(clienteB.idCliente)}>Actualizar</button>
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

export default ClienteView;
