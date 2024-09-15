const express = require('express');

const respuesta = require('../../red/respuestas');
const controlador = require('./index');

const router = express.Router();
/**
 * @swagger
 * components:
 *  schemas:
 *   facturasCompra:
 *    type: object
 *    properties:
 *      idFacturaCompra:
 *          type: integer
 *          description: Identificador único de la factura de compra en la base de datos.
 *      numeroFactura:
 *          type: string
 *          description: Número de factura de la compra.
 *      idCompra:
 *          type: integer
 *          description: Identificador de la compra asociada a la factura.
 *    required:
 *      - idFacturaCompra
 *      - numeroFactura
 *      - idCompra
 */

/**
 * @swagger
 * /facturasCompra:
 *   get:
 *     summary: Obtiene todas las facturas de compra almacenadas en la base de datos.
 *     tags: [facturasCompra]
 *     responses:
 *       200:
 *         description: Lista de todas las facturas de compra almacenadas en la base de datos.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/facturasCompra'
 *       500:
 *         description: Error interno del servidor.
 */
router.get('/', todos);
/**
 * @swagger
 * /facturasCompra/{id}:
 *   get:
 *     summary: Obtiene una factura de compra por su ID.
 *     tags: [facturasCompra]
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID de la factura de compra a obtener.
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Factura de compra obtenida correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/facturasCompra'
 *       404:
 *         description: Factura de compra no encontrada.
 *       500:
 *         description: Error interno del servidor.
 */
router.get('/:id', uno);
/*router.post('/', agregar);*/
/*router.put('/', eliminar);*/

/**
 * @swagger
 * /facturasCompra:
 *   delete:
 *     summary: Elimina todas las facturas de compra.
 *     tags: [facturasCompra]
 *     responses:
 *       200:
 *         description: Todas las facturas de compra han sido eliminadas correctamente.
 *       500:
 *         description: Error interno del servidor al intentar eliminar las facturas de compra.
 */
router.delete('/', eliminar);
/**
 * @swagger
 * /facturasCompra:
 *   post:
 *     summary: Agrega una nueva factura de compra a la base de datos.
 *     tags: [facturasCompra]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/FacturaCompra'
 *     responses:
 *       200:
 *         description: Nueva factura de compra agregada correctamente a la base de datos.
 *       400:
 *         description: Error en la solicitud o formato de datos incorrecto.
 *       500:
 *         description: Error interno del servidor al intentar agregar la factura de compra.
 */
router.post('/', agregar);

/**
 * @swagger
 * /facturasCompra:
 *   put:
 *     summary: Actualiza una factura de compra existente en la base de datos.
 *     tags: [facturasCompra]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/FacturaCompra'
 *     responses:
 *       200:
 *         description: Factura de compra actualizada correctamente en la base de datos.
 *       400:
 *         description: Error en la solicitud o formato de datos incorrecto.
 *       404:
 *         description: La factura de compra no se encontró en la base de datos.
 *       500:
 *         description: Error interno del servidor al intentar actualizar la factura de compra.
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