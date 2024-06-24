const express = require('express');
const respuesta = require('../../red/respuestas');
const controlador = require('./index');
const db = require('../../DB/proveedoresMysql.js');
const app = express();

/**
 * @swagger
 * components:
 *  schemas:
 *   proveedores:
 *    type: object
 *    properties:
 *      idProveedor:
 *          type: integer
 *          description: ID autogenerado en la base de datos para el proveedor
 *      nombre:
 *          type: string
 *          description: Nombre del proveedor
 *      direccion:
 *          type: string
 *          description: Dirección del proveedor
 *      telefono:
 *          type: string
 *          description: Teléfono del proveedor
 *      idUsuario:
 *          type: integer
 *          description: ID del usuario asociado al Usuario
 *    required:
 *      - idProveedor
 *      - nombre
 *      - direccion
 *      - telefono
 *      - idUsuario
 */

/**
 * @swagger
 * /proveedores:
 *      get:
 *          summary: Retorna todos los registros de la entidad proveedores
 *          tags: [proveedores]
 *          responses:
 *           200:
 *               description: Esta es la lista de los proveedores en la BdD
 *               content:
 *                   application/json:
 *                       schema:
 *                           type: array
 *                           items:
 *                            $ref: '#/components/schemas/proveedores'
 * 
 */

app.get('/', todos);
/**
 * @swagger
 * /proveedores/{idProveedor}:
 *   get:
 *     summary: Obtiene un proveedor por su ID
 *     tags: [proveedores]
 *     parameters:
 *       - in: path
 *         name: idProveedor
 *         description: ID del proveedor a obtener
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Proveedor obtenido correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/proveedores'
 *       404:
 *         description: Proveedor no encontrado
 *       500:
 *         description: Error interno del servidor
 */
app.get('/:nombreProveedores', buscarPorNombre);
/**
 * @swagger
 * /proveedores:
 *   post:
 *     summary: Agrega un nuevo proveedor a la base de datos
 *     tags: [proveedores]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/proveedores'
 *     responses:
 *       200:
 *         description: Nuevo proveedor creado en la base de datos
 *       400:
 *         description: Error en la solicitud o formato de datos incorrecto
 *       500:
 *         description: Error interno del servidor
 */
app.post('/', agregar);
/**
 * @swagger
 * /proveedores/{idProveedor}:
 *   put:
 *     summary: Actualiza un proveedor existente en la base de datos
 *     tags: [proveedores]
 *     parameters:
 *       - in: path
 *         name: idProveedor
 *         description: ID del proveedor a actualizar
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/proveedores'
 *     responses:
 *       200:
 *         description: Proveedor actualizado correctamente
 *       400:
 *         description: Error en la solicitud o formato de datos incorrecto
 *       404:
 *         description: Proveedor no encontrado
 *       500:
 *         description: Error interno del servidor
 */
app.put('/:idProveedor', actualizar);

/**
 * @swagger
 * /proveedores/{idProveedor}:
 *   delete:
 *     summary: Elimina un proveedor existente de la base de datos
 *     tags: [proveedores]
 *     parameters:
 *       - in: path
 *         name: idProveedor
 *         description: ID del proveedor a eliminar
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Proveedor eliminado correctamente
 *       404:
 *         description: Proveedor no encontrado
 *       500:
 *         description: Error interno del servidor
 */

app.delete('/:idProveedor', eliminar);

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
      const nombreProveedores = req.params.nombreProveedores;
      const proveedor = await db.buscarPorNombre(nombreProveedores);
      respuesta.success(req, res, proveedor, 200);
    } catch (err) {
      next(err);
    }
  }

async function agregar(req,res, next){ // Para manejar POST
    try{
        const items = await controlador.agregar(req.body);
        respuesta.success(req,res,'Item guardado con exito', 201);
    } catch(err){
       next(err);
    }
};




async function actualizar(req, res, next) {
    try {
        const idProveedor = req.params.idProveedor; // Obtener el ID del parámetro de la URL
        const items = await controlador.actualizar(idProveedor, req.body); // Llamar al controlador para actualizar el elemento
        respuesta.success(req, res, 'Item actualizado con éxito', 200); // Responder con éxito
    } catch (err) {
        next(err); // Pasar cualquier error al siguiente middleware
    }
}


async function eliminar(req, res, next) {
    try {
        // Obtener el ID del cliente desde los parámetros de la ruta
        const idProveedor = req.params.idProveedor;

        // Llamar al método del controlador para eliminar el elemento
        await controlador.eliminar(idProveedor);

        // Enviar una respuesta de éxito
        respuesta.success(req, res, 'Elemento eliminado con éxito', 200);
    } catch (err) {
        // Pasar el control al siguiente middleware de manejo de errores
        next(err);
    }
}


module.exports = app;