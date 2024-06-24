const express = require('express');

const respuesta = require('../../red/respuestas');
const controlador = require('./index');

const router = express.Router();
/**
 * @swagger
 * components:
 *  schemas:
 *   detallesCompra:
 *    type: object
 *    properties:
 *      idFacturaCompra:
 *          type: integer
 *          description: Identificador único de la factura de compra en la base de datos.
 *      numeroFactura:
 *          type: string
 *          description: Número de factura asociado a la compra.
 *      idCompra:
 *          type: integer
 *          description: Identificador único de la compra asociada a la factura en la base de datos.
 *    required:
 *      - idFacturaCompra
 *      - numeroFactura
 *      - idCompra
 */
/**
 * @swagger
 * /:
 *   get:
 *     summary: Obtiene todos los detalles de compra almacenados en la base de datos.
 *     tags: [detallesCompra]
 *     responses:
 *       200:
 *         description: Lista de todos los detalles de compra almacenados en la base de datos.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/detallesCompra'
 *       500:
 *         description: Error interno del servidor.
 */
router.get('/', todos);
/**
 * @swagger
 * /{id}:
 *   get:
 *     summary: Obtiene un detalle de compra por su ID.
 *     tags: [detallesCompra]
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID del detalle de compra a obtener.
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Detalle de compra obtenido correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/detallesCompra'
 *       404:
 *         description: Detalle de compra no encontrado.
 *       500:
 *         description: Error interno del servidor.
 */
router.get('/:id', uno);
/*router.post('/', agregar);*/
/*router.put('/', eliminar);*/
/**
 * @swagger
 * /:
 *   delete:
 *     summary: Elimina todos los detalles de compra.
 *     tags: [detallesCompra]
 *     responses:
 *       200:
 *         description: Detalles de compra eliminados correctamente.
 *       500:
 *         description: Error interno del servidor.
 */
router.delete('/', eliminar);
/**
 * @swagger
 * /:
 *   post:
 *     summary: Agrega un nuevo detalle de compra.
 *     tags: [detallesCompra]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DetallesCompra'
 *     responses:
 *       200:
 *         description: Detalle de compra agregado correctamente.
 *       400:
 *         description: Error en la solicitud o formato de datos incorrecto.
 *       500:
 *         description: Error interno del servidor.
 */
router.post('/', agregar);
/**
 * @swagger
 * /:
 *   put:
 *     summary: Actualiza un detalle de compra existente.
 *     tags: [detallesCompra]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DetallesCompra'
 *     responses:
 *       200:
 *         description: Detalle de compra actualizado correctamente.
 *       400:
 *         description: Error en la solicitud o formato de datos incorrecto.
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