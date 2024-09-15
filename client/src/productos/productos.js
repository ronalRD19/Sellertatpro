import { useDispatch, useSelector } from 'react-redux';
import { setProductIds } from './productsSlice';
import React, { useState, useEffect, useRef } from 'react';
import Axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import "./productos.css";

const ProductoView = () => {
  const [idArregloProducto, setIdArregloProducto] = useState([]);
  const dispatch = useDispatch();
  const usuario = useSelector(state => state.login_registro.usuario);
  const rol = usuario ? usuario.rol : '';
  console.log("Este es el rol en productos", rol);

  const mandarInformacionAventas = () => {
    console.log("arreglo en productos", idArregloProducto);
    dispatch(setProductIds(idArregloProducto));
  };

  const inputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [productos, setProductos] = useState([]);
  const [nuevoProducto, setNuevoProducto] = useState({
    nombre: '',
    precio: '',
    stock: '',
    idProveedor: '',
    imagenProducto: null,
  });
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [productoEditado, setProductoEditado] = useState({
    nombre: '',
    precio: '',
    stock: '',
    idProveedor: '',
    imagenProducto: null,
  });
  const [productoBuscado, setProductoBuscado] = useState([]);
  const [mostrarTodos, setMostrarTodos] = useState(false);
  const [busquedaRealizada, setBusquedaRealizada] = useState(false);
  const [buttonClicked, setButtonClicked] = useState({});

  const handleClick = (id) => {
    setButtonClicked(prevState => {
      const newState = { ...prevState, [id]: !prevState[id] };
      if (newState[id]) {
        setIdArregloProducto(prevIds => [...prevIds, id]);
      } else {
        setIdArregloProducto(prevIds => prevIds.filter(productId => productId !== id));
      }
      return newState;
    });
  };

  useEffect(() => {
    if (mostrarTodos) {
      obtenerProductos();
    }
  }, [mostrarTodos]);

  const selectedHandler = (e) => {
    if (e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
    }
  };



  const validateEditedProductData = (product) => {
    return product.nombre && product.precio && product.stock && product.idProveedor;
  };

  const sendHandler = async (e) => {
    e.preventDefault();
    if (!nuevoProducto.nombre || !nuevoProducto.precio || !nuevoProducto.stock || !nuevoProducto.idProveedor || !file) {
      alert('Por favor, complete todos los campos.');
      return;
    }

    const formData = new FormData();
    formData.append('nombre', nuevoProducto.nombre);
    formData.append('precio', nuevoProducto.precio);
    formData.append('stock', nuevoProducto.stock);
    formData.append('idProveedor', nuevoProducto.idProveedor);
    formData.append('imagenProducto', file);

    try {
      await Axios.post('http://localhost:3001/productos', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setNuevoProducto({ nombre: '', precio: '', stock: '', idProveedor: '', imagenProducto: null });
      setFile(null);
      obtenerProductos();
    } catch (error) {
      console.error('Error al agregar producto:', error);
    }

    document.getElementById('fileinput').value = null;
  };

  const obtenerProductos = async () => {
    try {
      const response = await Axios.get('http://localhost:3001/productos');
      if (Array.isArray(response.data.body)) {
        setProductos(response.data.body);
      } else {
        console.error('Los datos recibidos no son un array:', response.data);
        setProductos([]);
      }
    } catch (error) {
      console.error('Error al obtener productos:', error);
      setProductos([]);
    }
  };

  const handleInputChange = (e) => {
    setNuevoProducto({ ...nuevoProducto, [e.target.name]: e.target.value });
  };

  const handleInputChangeEditado = (e) => {
    setProductoEditado({ ...productoEditado, [e.target.name]: e.target.value });
  };

  const handleEditarProducto = (producto) => {
    setProductoSeleccionado(producto);
    setProductoEditado(producto);
  };

  const handleBuscarProducto = async () => {
    const valorBuscado = inputRef.current.value;
    try {
      const response = await Axios.get(`http://localhost:3001/productos/${valorBuscado}`);
      if (Array.isArray(response.data.body)) {
        setProductoBuscado(response.data.body);
      } else {
        console.error('Los datos recibidos no son un array:', response.data);
        setProductoBuscado([]);
      }
      if (mostrarTodos) {
        setMostrarTodos(false);
        setProductos([]);
      }
      setBusquedaRealizada(true);
    } catch (error) {
      console.error('Error al obtener productos:', error);
      setProductoBuscado([]);
    }
  };

  const handleActualizarProducto = async (idProducto) => {
    if (!validateEditedProductData(productoEditado)) {
      alert('Por favor, complete todos los campos.');
      return;
    }

    const confirmUpdate = window.confirm('¿Está seguro que desea modificar el producto?');
    if (!confirmUpdate) return;

    try {
      const response = await Axios.put(`http://localhost:3001/productos/${idProducto}`, productoEditado);
      console.log('Producto actualizado:', response.data);
      obtenerProductos();
    } catch (error) {
      console.error('Error al actualizar producto:', error);
    }
  };

  const handleEliminarProducto = async (idProducto) => {
    if (!idProducto) {
      alert('Producto no válido para eliminar.');
      return;
    }

    const confirmDelete = window.confirm('¿Está seguro que desea eliminar el producto?');
    if (!confirmDelete) return;

    try {
      await Axios.delete(`http://localhost:3001/productos/${idProducto}`);
      obtenerProductos();
    } catch (error) {
      console.error('Error al eliminar producto:', error);
    }
  };

  const handleMostrarTodosLosProductos = async () => {
    setProductoBuscado([]);
    if (busquedaRealizada) {
      setBusquedaRealizada(false);
    }
    if (mostrarTodos) {
      setMostrarTodos(false);
      setProductos([]);
    } else {
      await obtenerProductos();
      setMostrarTodos(true);
    }
  };

  return (
    <div className="container-fluid">
      <h1 className="text-center">Productos</h1>
      <div className="row">
        <div className="col-md-6">
          <form onSubmit={sendHandler} encType="multipart/form-data">
            <div className="mb-3">
              <input
                type="text"
                name="nombre"
                placeholder="Nombre"
                value={nuevoProducto.nombre}
                onChange={handleInputChange}
                className="form-control"
              />
            </div>
            <div className="mb-3">
              <input
                type="text"
                name="precio"
                placeholder="Precio"
                value={nuevoProducto.precio}
                onChange={handleInputChange}
                className="form-control"
              />
            </div>
            <div className="mb-3">
              <input
                type="text"
                name="stock"
                placeholder="Stock"
                value={nuevoProducto.stock}
                onChange={handleInputChange}
                className="form-control"
              />
            </div>
            <div className="mb-3">
              <input
                type="text"
                name="idProveedor"
                placeholder="ID Proveedor"
                value={nuevoProducto.idProveedor}
                onChange={handleInputChange}
                className="form-control"
              />
            </div>
            <div className="mb-3">
              <input
                type="file"
                id="fileinput"
                name="imagenProducto"
                accept="image/*"
                onChange={selectedHandler}
                className="form-control"
              />
            </div>
            <div className="mb-3">
              <button className="btn btn-primary" type="submit">Agregar Producto</button>
            </div>
          </form>
        </div>
        <div className="col-md-6">
          <form className="mb-3">
            <div className="mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Nombre del producto"
                ref={inputRef}
              />
            </div>
            <div className="mb-3">
              <button type="button" className="btn btn-primary" onClick={handleBuscarProducto}>Buscar</button>
            </div>
          </form>
        </div>
      </div>
      <div className="row">
        <div className="col-md-12">
          <button className="btn btn-primary" onClick={handleMostrarTodosLosProductos}>
            {mostrarTodos ? 'Ocultar Todos los Productos' : (busquedaRealizada ? 'Mostrar Todos los Productos' : 'Mostrar Todos los Productos')}
          </button>
          <button className="btn btn-primary" onClick={mandarInformacionAventas}>
            Mandar a ventas
          </button>
        </div>
      </div>
      <div className="row">
        {productos.map((producto) => (
          <div key={producto.idProducto} className="col-md-4 col-sm-6">
            <div className="card">
              <button
                className={`btn ${buttonClicked[producto.idProducto] ? 'btn-danger' : 'btn-success'}`}
                onClick={() => handleClick(producto.idProducto)}
              >
                Ver detalles del producto
              </button>
              <div className="card-body">
                <h5 className="card-title">Nombre: {producto.nombre}</h5>
                <p className="card-text">Precio: {producto.precio}</p>
                <p className="card-text">Stock: {producto.stock}</p>
                <p className="card-text">ID Proveedor: {producto.idProveedor}</p>
                {rol === 'admin' && (
                  <>
                    <button className="btn btn-primary" onClick={() => handleEditarProducto(producto)}>Editar</button>
                    <button className="btn btn-danger" onClick={() => handleEliminarProducto(producto.idProducto)}>Eliminar</button>
                  </>
                )}
                <img
                  src={`http://localhost:3001/uploads/${producto.imagenProducto}`}
                  alt={`Descripción de la ${producto.imagenProducto}`}
                  className="img-fluid"
                />
                {producto === productoSeleccionado && (
                  <div>
                    <input
                      type="text"
                      name="nombre"
                      value={productoEditado.nombre}
                      onChange={handleInputChangeEditado}
                      className="form-control"
                    />
                    <input
                      type="text"
                      name="precio"
                      value={productoEditado.precio}
                      onChange={handleInputChangeEditado}
                      className="form-control"
                    />
                    <input
                      type="text"
                      name="stock"
                      value={productoEditado.stock}
                      onChange={handleInputChangeEditado}
                      className="form-control"
                    />
                    <input
                      type="text"
                      name="idProveedor"
                      value={productoEditado.idProveedor}
                      onChange={handleInputChangeEditado}
                      className="form-control"
                    />
                    {rol === 'admin' && (
                      <button className="btn btn-success" onClick={() => handleActualizarProducto(producto.idProducto)}>Actualizar</button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="row">
        {Array.isArray(productoBuscado) && productoBuscado.map((productoB) => (
          <div key={productoB.idProducto} className="col-md-4 col-sm-6">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Nombre: {productoB.nombre}</h5>
                <p className="card-text">Precio: {productoB.precio}</p>
                <p className="card-text">Stock: {productoB.stock}</p>
                <p className="card-text">ID Proveedor: {productoB.idProveedor}</p>
                {rol === 'admin' && (
                  <>
                    <button className="btn btn-primary" onClick={() => handleEditarProducto(productoB)}>Editar</button>
                    <button className="btn btn-danger" onClick={() => handleEliminarProducto(productoB.idProducto)}>Eliminar</button>
                  </>
                )}
                <img
                  src={`http://localhost:3001/uploads/${productoB.imagenProducto}`}
                  alt={`Descripción de la ${productoB.imagenProducto}`}
                  className="img-fluid"
                />
                {productoB === productoSeleccionado && (
                  <div>
                    <input
                      type="text"
                      name="nombre"
                      value={productoEditado.nombre}
                      onChange={handleInputChangeEditado}
                      className="form-control"
                    />
                    <input
                      type="text"
                      name="precio"
                      value={productoEditado.precio}
                      onChange={handleInputChangeEditado}
                      className="form-control"
                    />
                    <input
                      type="text"
                      name="stock"
                      value={productoEditado.stock}
                      onChange={handleInputChangeEditado}
                      className="form-control"
                    />
                    <input
                      type="text"
                      name="idProveedor"
                      value={productoEditado.idProveedor}
                      onChange={handleInputChangeEditado}
                      className="form-control"
                    />
                    {rol === 'admin' && (
                      <button className="btn btn-success" onClick={() => handleActualizarProducto(productoB.idProducto)}>Actualizar</button>
                    )}
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

export default ProductoView;
