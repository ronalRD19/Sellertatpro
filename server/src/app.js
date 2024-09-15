const express = require('express');
const path = require('path'); // Agrega esta línea para importar el módulo path
const config = require('./config.js');
const morgan = require('morgan');
const cors = require('cors');
const clientes = require('./modulos/clientes/rutas.js');
const detalleCompras = require('./modulos/detallesCompras/rutas.js');
const detalleVentas = require('./modulos/detallesVentas/rutas.js');
const facturasCompra = require('./modulos/facturasCompra/rutas.js');
const facturasVenta = require('./modulos/facturasVenta/rutas.js');
const productos = require('./modulos/productos/rutas.js');
const proveedores = require('./modulos/proveedores/rutas.js');
const usuarios = require('./modulos/usuarios/rutas.js');
const ventas = require('./modulos/ventas/rutas.js');
const detallesVentas = require('./modulos/detallesVentas/rutas.js');
const auth = require('./modulos/auth/rutas.js');
const error = require('./red/errors.js');

const app = express();
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set('port', config.app.port);

// Define la ruta para servir archivos estáticos desde el directorio uploads


app.use('/clientes', clientes);
app.use('/usuarios', usuarios);
app.use('/auth', auth);
app.use('/ventas', ventas);
app.use('/productos', productos);
app.use('/proveedores', proveedores);
app.use('/detalleCompras', detalleCompras);
app.use('/detalleVentas', detalleVentas);
app.use('/facturasCompra', facturasCompra);
app.use('/facturasVenta', facturasVenta);
app.use('/detallesVentas', detallesVentas);
app.use('/uploads', express.static(path.join(__dirname, './modulos/uploads')));
app.use(error);

module.exports = app;