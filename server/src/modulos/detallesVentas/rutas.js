const express = require('express');

const respuesta = require('../../red/respuestas');
const controlador = require('./index');

const router = express.Router();
/**
 * @swagger
 * components:
 *  schemas:
 *   detallesVentas:
 *    type: object
 *    properties:
 *      idFacturaVenta:
 *          type: integer
 *          description: Identificador único de la factura de venta en la base de datos.
 *      numeroFactura:
 *          type: string
 *          description: Número de factura de la venta.
 *      idVenta:
 *          type: integer
 *          description: Identificador único de la venta asociada.
 *    required:
 *      - idFacturaVenta
 *      - numeroFactura
 *      - idVenta
 */

/**
 * @swagger
 * /detallesVentas:
 *   get:
 *     summary: Obtiene todos los detalles de ventas almacenados en la base de datos.
 *     tags: [detallesVentas]
 *     responses:
 *       200:
 *         description: Lista de todos los detalles de ventas almacenados en la base de datos.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/detallesVentas'
 *       500:
 *         description: Error interno del servidor.
 */
router.get('/', todos);
/**
 * @swagger
 * /detallesVentas/{id}:
 *   get:
 *     summary: Obtiene un detalle de venta por su ID.
 *     tags: [detallesVentas]
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID del detalle de venta a obtener.
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Detalle de venta obtenido correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/detallesVentas'
 *       404:
 *         description: Detalle de venta no encontrado.
 *       500:
 *         description: Error interno del servidor.
 */
router.get('/:id', uno);
/*router.post('/', agregar);*/
/*router.put('/', eliminar);*/
/**
 * @swagger
 * /detallesVentas:
 *   delete:
 *     summary: Elimina todos los detalles de venta.
 *     tags: [detallesVentas]
 *     responses:
 *       200:
 *         description: Detalles de venta eliminados correctamente.
 *       500:
 *         description: Error interno del servidor.
 */
router.delete('/', eliminar);
/**
 * @swagger
 * /detallesVentas:
 *   post:
 *     summary: Agrega un nuevo detalle de venta a la base de datos.
 *     tags: [detallesVentas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DetalleVenta'
 *     responses:
 *       200:
 *         description: Nuevo detalle de venta agregado correctamente.
 *       400:
 *         description: Error en la solicitud o formato de datos incorrecto.
 *       500:
 *         description: Error interno del servidor.
 */
router.post('/', agregar);
/**
 * @swagger
 * /detallesVentas:
 *   put:
 *     summary: Actualiza un detalle de venta en la base de datos.
 *     tags: [detallesVentas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DetalleVenta'
 *     responses:
 *       200:
 *         description: Detalle de venta actualizado correctamente.
 *       400:
 *         description: Error en la solicitud o formato de datos incorrecto.
 *       404:
 *         description: Detalle de venta no encontrado.
 *       500:
 *         description: Error interno del servidor.
 */
router.put('/', actualizar);

async function todos(req,res, next){
    try{
        const items = await controlador.todos();
        respuesta.success(req,res,items,200);
    } catch(err){
        next(err);
    }
    
};

 async function uno(req,res, next){
    try{
        const items = await controlador.uno(req.params.id);
    respuesta.success(req,res,items,200);
    } catch(err){
        next(err);
    }
   
};

async function eliminar(req,res, next){
    try{
        const items = await controlador.eliminar(req.body);
    respuesta.success(req,res,'Item eliminado con exito',200);
    } catch(err){
       next(err);
    }
   
};

/*async function agregar(req,res, next){
    try{
        const items = await controlador.agregar(req.body);
        if(req.body.id == 0){
            mensaje = 'Item guardado con exito';
        }else{
            mensaje = 'Item actualizado con exito';
        }
    respuesta.success(req,res,mensaje, 201);
    } catch(err){
       next(err);
    }
   
};*/
async function agregar(req,res, next){ // Para manejar POST
    try{
        const items = await controlador.agregar(req.body);
        respuesta.success(req,res,'Item guardado con exito', 201);
    } catch(err){
       next(err);
    }
}

async function actualizar(req,res, next){ // Para manejar PUT
    try{
        const items = await controlador.actualizar(req.body);
        respuesta.success(req,res,'Item actualizado con exito', 200);
    } catch(err){
       next(err);
    }
}



module.exports = router;