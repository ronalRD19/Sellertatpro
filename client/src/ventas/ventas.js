import React, { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Axios from 'axios';
import { addProduct, clearProducts } from '../productos/productsSlice';
import { logoutUser } from '../login_registro/UserSlice';
import Modal from 'react-modal';
import 'bootstrap/dist/css/bootstrap.min.css';
import './ventas.css';

const Ventas = () => {
  const inputRef = useRef(null);
  const cedulaRef = useRef(null);
  const idsProducto = useSelector(state => state.products.productIds);
  const productos = useSelector(state => state.products.products);
  const usuario = useSelector(state => state.login_registro.usuario);
  const idUsuario = usuario ? usuario.idUsuario : '';

  const dispatch = useDispatch();
  const loaded = useRef(false);
  const [contadores, setContadores] = useState({});
  const [total, setTotal] = useState(0);
  const [subtotales, setSubtotales] = useState({});
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [facturasModalIsOpen, setFacturasModalIsOpen] = useState(false);
  const [clienteBuscado, setClienteBuscado] = useState(null);
  const [mensajeCliente, setMensajeCliente] = useState('');
  const [nombreUsuario, setNombreUsuario] = useState('');
  const [resumenVentas, setResumenVentas] = useState([]);
  const [totalProductos, setTotalProductos] = useState(0);
  const [facturas, setFacturas] = useState([]);

  const fetchUsuario = async (id) => {
    try {
      const response = await Axios.get(`http://localhost:3001/auth/usuario`);
      if (response.data && response.data.body && response.data.body.length > 0) {
        setNombreUsuario(response.data.body[0].nombre);
      }
    } catch (error) {
      console.error('Error al obtener el nombre del usuario:', error);
    }
  };

  useEffect(() => {
    if (usuario) {
      fetchUsuario(usuario);
    }
  }, [usuario]);

  useEffect(() => {
    const fetchProducts = async () => {
      if (!loaded.current) {
        dispatch(clearProducts());
        for (const id of idsProducto) {
          try {
            const response = await Axios.get(`http://localhost:3001/productos/idProducto/${id}`);
            if (response.data && Array.isArray(response.data.body)) {
              dispatch(addProduct(response.data.body[0]));
            }
          } catch (error) {
            console.error('Error al obtener productos:', error);
          }
        }
        loaded.current = true;
      }
    };

    if (idsProducto.length > 0 && !loaded.current) {
      fetchProducts();
    }
  }, [idsProducto, dispatch]);

  useEffect(() => {
    const newCounters = {};
    productos.forEach(producto => {
      newCounters[producto.idProducto] = (contadores[producto.idProducto] !== undefined) ? contadores[producto.idProducto] : 1;
    });
    setContadores(newCounters);
  }, [productos]);

  useEffect(() => {
    const calculateTotals = () => {
      let newTotal = 0;
      let newSubtotales = {};
      let newTotalProductos = 0;
      productos.forEach(producto => {
        const cantidad = contadores[producto.idProducto] ?? 0;
        const subtotal = producto.precio * cantidad;
        newSubtotales[producto.idProducto] = subtotal;
        newTotal += subtotal;
        newTotalProductos += cantidad;
      });
      setTotal(newTotal);
      setSubtotales(newSubtotales);
      setTotalProductos(newTotalProductos);
    };

    calculateTotals();
  }, [contadores, productos]);

  const incrementar = (idProducto) => {
    setContadores(prev => ({ ...prev, [idProducto]: (prev[idProducto] ?? 0) + 1 }));
  };

  const decrementar = (idProducto) => {
    if (contadores[idProducto] > 0) {
      setContadores(prev => ({ ...prev, [idProducto]: prev[idProducto] - 1 }));
    }
  };

  const openModal = () => {
    if (!clienteBuscado) {
      alert('Debe buscar y seleccionar un cliente antes de generar la factura.');
      return;
    }
    const resumen = productos.map(producto => ({
      nombre: producto.nombre,
      cantidad: contadores[producto.idProducto],
      precio: producto.precio,
      subtotal: subtotales[producto.idProducto]
    }));
    setResumenVentas(resumen);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setClienteBuscado(null);
    setMensajeCliente('');
    cedulaRef.current.value = '';
    setModalIsOpen(false);
  };

  const handleBuscarCliente = async () => {
    const valorBuscado = cedulaRef.current.value;
    try {
      const response = await Axios.get(`http://localhost:3001/clientes/cedula/${valorBuscado}`);
      if (response.data.body.length > 0) {
        setClienteBuscado(response.data.body[0]);
        setMensajeCliente(`Cliente encontrado: ${response.data.body[0].nombre}`);
      } else {
        setMensajeCliente('El cliente no existe');
      }
    } catch (error) {
      console.error('Error al obtener clientes:', error);
      setMensajeCliente('Error al buscar el cliente');
    }
  };

  const handleGenerarFactura = async () => {
    if (!clienteBuscado) {
      alert('Debe buscar y seleccionar un cliente antes de generar la factura.');
      return;
    }

    const factura = {
      montoTotal: total,
      cantidadTotal: totalProductos,
      idCliente: clienteBuscado?.idCliente,
      idUsuario: idUsuario,
      productos: productos.map(producto => ({
        idProducto: producto.idProducto,
        cantidad: contadores[producto.idProducto],
        nombre: producto.nombre,
        precio: producto.precio
      }))
    };

    try {
      const response = await Axios.post('http://localhost:3001/ventas', factura);
      if (response.data && response.data.status === 201) {
        alert('Factura generada con éxito');
        closeModal();
        fetchFacturas(); // Actualizar la lista de facturas después de generar una nueva
      } else {
        alert('Error al generar la factura');
      }
    } catch (error) {
      console.error('Error al generar la factura:', error);
      alert('Error al generar la factura');
    }
  };

  const fetchFacturas = async () => {
    try {
      const response = await Axios.get('http://localhost:3001/ventas');
      if (response.data && Array.isArray(response.data.body)) {
        setFacturas(response.data.body);
      } else {
        setFacturas([]);
      }
    } catch (error) {
      console.error('Error al obtener facturas:', error);
    }
  };

  const openFacturasModal = () => {
    fetchFacturas();
    setFacturasModalIsOpen(true);
  };

  const closeFacturasModal = () => {
    setFacturasModalIsOpen(false);
  };

  const handleEliminarFactura = async (idFactura) => {
    try {
      const response = await Axios.delete(`http://localhost:3001/ventas/${idFactura}`);
      if (response.data && response.data.status === 200) {
        alert('Factura eliminada con éxito');
        fetchFacturas(); // Actualizar la lista de facturas después de eliminar una
      } else {
        alert('Error al eliminar la factura');
      }
    } catch (error) {
      console.error('Error al eliminar la factura:', error);
      alert('Error al eliminar la factura');
    }
  };

  return (
    <div className="parent-container" style={{ display: 'flex', flexDirection: 'column' }}>
      <div className="main-content" style={{ display: 'flex', flex: '1' }}>
        <div className="product-list" style={{ flex: '1' }}>
          <div className="row">
            {productos.map(producto => (
              <div key={producto.idProducto} className="col-12">
                <div className="card">
                  <div className="card-body d-flex justify-content-between align-items-center">
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', flex: '0 1 auto' }}>
                      <img
                        src={`http://localhost:3001/uploads/${producto.imagenProducto}`}
                        alt={`Descripción de la ${producto.imagenProducto}`}
                        className="img-fluid"
                        style={{ maxHeight: '100px', marginRight: '1rem' }}
                      />
                    </div>
                    <div style={{ flex: '1 1 auto' }}>
                      <h5 className="card-title">{producto.nombre}</h5>
                      <p className="card-text">Precio: {producto.precio}</p>
                      <p className="card-text">Stock: {producto.stock}</p>
                    </div>
                    <div className="counter d-flex align-items-center">
                      <button onClick={() => decrementar(producto.idProducto)}>-</button>
                      <span className="mx-2">{contadores[producto.idProducto]}</span>
                      <button onClick={() => incrementar(producto.idProducto)}>+</button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="side-card-container" style={{ flex: '2', padding: '50px'}}>
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Resumen de Ventas</h5>
              {productos.map(producto => (
                <p key={producto.idProducto} className="card-text">{producto.nombre}: {contadores[producto.idProducto]} x {producto.precio} = {subtotales[producto.idProducto]}</p>
              ))}
              <p className="card-text">Total de Productos: {totalProductos}</p>
              <p className="card-text">Total: {total}</p>

              <div>
                <input type="text" ref={cedulaRef} placeholder="Ingrese cédula del cliente" />
                <button onClick={handleBuscarCliente}>Buscar Cliente</button>
                <p>{mensajeCliente}</p>
              </div>
            </div>
          </div>

          <button className="btn btn-success" onClick={openModal}>Generar Factura</button>
          <button className="btn btn-success" onClick={openFacturasModal}>Facturas</button>
        </div>  
      </div>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Factura Modal"
        ariaHideApp={false}
      >
        <div className="user-info" style={{ padding: '10px', backgroundColor: '#f5f5f5', marginBottom: '10px' }}>
          <h4>Factura</h4>
          <p>Usuario: {usuario ? usuario.usuario : ''}</p>
          <p>Nombre Cliente: {clienteBuscado?.nombre}</p>
          <p className="card-text">Total de Productos: {totalProductos}</p>
          <div>
            <h5>Resumen de Ventas</h5>
            {resumenVentas.map((item, index) => (
              <p key={index}>{item.nombre}: {item.cantidad} x {item.precio} = {item.subtotal}</p>
            ))}
            <p>Total: {resumenVentas.reduce((acc, item) => acc + item.subtotal, 0)}</p>
          </div>
        </div>
        <button onClick={closeModal}>Cerrar</button>
        <button onClick={handleGenerarFactura}>Generar Factura</button>
      </Modal>

      <Modal
        isOpen={facturasModalIsOpen}
        onRequestClose={closeFacturasModal}
        contentLabel="Facturas Modal"
        ariaHideApp={false}
      >
        <h4>Lista de Facturas</h4>
        <div className="factura-list">
          {facturas.map(factura => (
            <div className="factura-item" key={factura.idVenta}>
              <p><strong>ID Factura:</strong> {factura.idVenta}</p>
              <p><strong>Fecha:</strong> {factura.fechaVenta}</p>
              <p><strong>Monto Total:</strong> {factura.montoTotal}</p>
              <p><strong>Cantidad Total:</strong> {factura.cantidadTotal}</p>
              <p><strong>ID Cliente:</strong> {factura.idCliente}</p>
              <p><strong>ID Usuario:</strong> {factura.idUsuario}</p>
              <h5>Productos</h5>
              {factura.productos.map((producto, index) => (
                <p key={index}>{producto.nombre}: {producto.cantidad}: {producto.cantidad} x {producto.precio}</p>
              ))}
              <button className="btn btn-danger" onClick={() => handleEliminarFactura(factura.idVenta)}>Eliminar</button>
            </div>
          ))}
        </div>
        <button onClick={closeFacturasModal}>Cerrar</button>
      </Modal>
    </div>
  );
}

export default Ventas;
