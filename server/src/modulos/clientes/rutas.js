const express = require('express');
const respuesta = require('../../red/respuestas');
const controlador = require('./index');
const db = require('../../DB/clientesMysql.js');

const app = express();


/**
 * @swagger
 * components:
 *  schemas:
 *   clientes:
 *    type: object
 *    properties:
 *      idCliente:
 *          type: integer
 *          description: Identificador único del cliente en la base de datos.
 *      nombre:
 *          type: string
 *          description: Nombre del cliente.
 *      direccion:
 *          type: string
 *          description: Dirección del cliente.
 *      telefono:
 *          type: string
 *          description: Teléfono del cliente.
 *    required:
 *      - idCliente
 *      - nombre
 *      - direccion
 *      - telefono
 */

/**
 * @swagger
 * /clientes:
 *   get:
 *     summary: Obtiene todos los clientes almacenados en la base de datos.
 *     tags: [clientes]
 *     responses:
 *       200:
 *         description: Lista de todos los clientes almacenados en la base de datos.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/clientes'
 *       500:
 *         description: Error interno del servidor.
 */

app.get('/', todos);
/**
 * @swagger
 * /clientes/{idCliente}:
 *   get:
 *     summary: Obtiene un cliente por su ID.
 *     tags: [clientes]
 *     parameters:
 *       - in: path
 *         name: idCliente
 *         description: ID del cliente a obtener.
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Cliente obtenido correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/clientes'
 *       404:
 *         description: Cliente no encontrado.
 *       500:
 *         description: Error interno del servidor.
 */
app.get('/:nombreCliente', buscarPorNombre);
app.get('/cedula/:cedulaCliente', buscarPorCedula);
/**
 * @swagger
 * /clientes:
 *   post:
 *     summary: Agrega un nuevo cliente a la base de datos.
 *     tags: [clientes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/clientes'
 *     responses:
 *       200:
 *         description: Nuevo cliente creado en la base de datos.
 *       400:
 *         description: Error en la solicitud o formato de datos incorrecto.
 *       500:
 *         description: Error interno del servidor.
 */
app.post('/', agregar);
/**
 * @swagger
 * /clientes/{idCliente}:
 *   put:
 *     summary: Actualiza un cliente existente en la base de datos.
 *     tags: [clientes]
 *     parameters:
 *       - in: path
 *         name: idCliente
 *         description: ID del cliente a actualizar.
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/clientes'
 *     responses:
 *       200:
 *         description: Cliente actualizado correctamente en la base de datos.
 *       400:
 *         description: Error en la solicitud o formato de datos incorrecto.
 *       404:
 *         description: Cliente no encontrado.
 *       500:
 *         description: Error interno del servidor.
 */
app.put('/:idCliente', actualizar);
/**
 * @swagger
 * /clientes/{idCliente}:
 *   delete:
 *     summary: Elimina un cliente existente de la base de datos.
 *     tags: [clientes]
 *     parameters:
 *       - in: path
 *         name: idCliente
 *         description: ID del cliente a eliminar.
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Cliente eliminado correctamente de la base de datos.
 *       404:
 *         description: Cliente no encontrado.
 *       500:
 *         description: Error interno del servidor.
 */
app.delete('/:idCliente', eliminar);
app.get('/id/:idCliente', buscarPorIdCliente);

async function todos(req,res, next){
    try{
        const items = await controlador.todos();
        respuesta.success(req,res,items,200);
    } catch(err){   
        next(err);
    }
    
};

async function buscarPorNombre(req, res, next) {
    try {
      const nombreCliente = req.params.nombreCliente;
      const clientes = await db.buscarPorNombre(nombreCliente);
      respuesta.success(req, res, clientes, 200);
    } catch (err) {
      next(err);
    }
  }

  async function buscarPorCedula(req, res, next) {
    try {
      const cedulaCliente = req.params.cedulaCliente;
      const clientes = await db.buscarPorCedula(cedulaCliente);
      respuesta.success(req, res, clientes, 200);
    } catch (err) {
      next(err);
    }
  }

  async function agregar(req, res, next) {
    try {
        const { nombre, direccion, telefono, cedula } = req.body;

        // Verificar si el cliente ya existe por el número de cédula
        const clienteExistente = await db.buscarPorCedula(cedula);
        if (clienteExistente.length > 0) {
            return res.status(400).send('El cliente ya existe en la base de datos.');
        }

        // Crear el nuevo cliente si no existe
        const nuevoCliente = { nombre, direccion, telefono, cedula };
        await controlador.agregar(nuevoCliente);
        respuesta.success(req, res, 'Cliente guardado con éxito', 201);
    } catch (err) {
        next(err);
    }
}




async function actualizar(req, res, next) {
    try {
        const idCliente = req.params.idCliente; // Obtener el ID del parámetro de la URL
        const items = await controlador.actualizar(idCliente, req.body); // Llamar al controlador para actualizar el elemento
        respuesta.success(req, res, 'Item actualizado con éxito', 200); // Responder con éxito
    } catch (err) {
        next(err); // Pasar cualquier error al siguiente middleware
    }
}


async function eliminar(req, res, next) {
    try {
        // Obtener el ID del cliente desde los parámetros de la ruta
        const idCliente = req.params.idCliente;

        // Llamar al método del controlador para eliminar el elemento
        await controlador.eliminar(idCliente);

        // Enviar una respuesta de éxito
        respuesta.success(req, res, 'Elemento eliminado con éxito', 200);
    } catch (err) {
        // Pasar el control al siguiente middleware de manejo de errores
        next(err);
    }
}

async function buscarPorIdCliente(req, res, next) {
    try {
        const idCliente = req.params.idCliente;
        const cliente = await db.buscarPorIdCliente(idCliente);
        console.log(cliente); // Verifica lo que se obtiene aquí
        if (!cliente || cliente.length === 0) {
            return respuesta.error(req, res, 'Cliente no encontrado', 404);
        }
        respuesta.success(req, res, cliente, 200);
    } catch (err) {
        next(err);
    }
}






module.exports = app;