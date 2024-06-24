const express = require('express');
const respuesta = require('../../red/respuestas');
const controlador = require('./index.js');

const router = express.Router();

router.get('/', todos);
router.get('/:idVenta', uno);
router.delete('/:idVenta', eliminar);
router.post('/', agregar);
router.put('/:idVenta', actualizar);

async function todos(req, res, next) {
    try {
        const items = await controlador.todos();
        respuesta.success(req, res, items, 200);
    } catch (err) {
        next(err);
    }
}

async function agregar (req, res, next) { //////////
    try {
        
        // Declarar datosVenta aquí para asegurarse de que se inicialice correctamente
        let datosVenta;

        const { montoTotal, cantidadTotal, idCliente, idUsuario, productos } = req.body;

        const now = new Date();
        const offset = now.getTimezoneOffset() * 60000; // Convertir el offset a milisegundos
        const localISOTime = new Date(now - offset).toISOString().slice(0, 10);


        // Formatear la fecha en el formato requerido ("YYYY-MM-DD")
        //const fechaVentaFormateada = new Date().toISOString().slice(0, 10);

        // Verifica si req.body tiene las propiedades necesarias
        if (!montoTotal || !idCliente || !idUsuario || !cantidadTotal || !productos || productos.length === 0) {
            return respuesta.error(req, res, 'La carga útil (payload) no contiene todas las propiedades necesarias para agregar una nueva venta.', 400);
        }
        
        // Crear el objeto datosVenta con las propiedades necesarias
        datosVenta = {
            fechaVenta: localISOTime,
            montoTotal,
            cantidadTotal,
            idCliente,
            idUsuario,
            productos,
        };

        console.log('Datos de venta recibidos en rutas.js:', datosVenta); // Agregar este registro de consola
        
        // Llama a la función agregarNuevaVenta con datosVenta
        await controlador.agregar(datosVenta); // Elimina 'idCliente,' de aquí
        respuesta.success(req, res, 'Venta guardada con éxito', 201);
    } catch (err) {
        next(err);
    }
}

async function uno(req, res, next) {
    try {
        const items = await controlador.uno(req.params.idVenta);
        respuesta.success(req, res, items, 200);
    } catch (err) {
        next(err);
    }
}

async function eliminar(req, res, next) {//////
    try {
        const mensaje = await controlador.eliminar(req.params.idVenta); // Llama a la función de eliminación del controlador
        respuesta.success(req, res, mensaje, 200); // Responde con éxito
    } catch (err) {
        next(err); // Pasa cualquier error al siguiente middleware de manejo de errores
    }
}

async function actualizar(req, res, next) { ///////
    try {
        const items = await controlador.actualizar(req.params.idVenta, req.body);
        respuesta.success(req, res, 'Item actualizado con éxito', 200);
    } catch (err) {
        next(err);
    }
}

module.exports = router;
