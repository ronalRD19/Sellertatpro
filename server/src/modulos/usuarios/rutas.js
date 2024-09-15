const express = require("express");

const seguridad = require("./seguridad");
const respuesta = require("../../red/respuestas");
const controlador = require("./index");

const router = express.Router();
/**
 * @swagger
 * components:
 *   schemas:
 *     Usuario:
 *       type: object
 *       properties:
 *         idUsuario:
 *           type: integer
 *           description: ID único del usuario generado automáticamente en la base de datos
 *         nombre:
 *           type: string
 *           description: Nombre del usuario
 *         rol:
 *           type: string
 *           description: Rol del usuario en el sistema
 *       required:
 *         - nombre
 *         - rol
 */

/**
 * @swagger
 * /usuarios:
 *   post:
 *     summary: Agrega un nuevo usuario a la base de datos
 *     tags: [usuarios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Usuario'
 *     responses:
 *       200:
 *         description: Nuevo usuario creado en la base de datos
 *       400:
 *         description: Error en la solicitud o formato de datos incorrecto
 *       500:
 *         description: Error interno del servidor
 */
router.get("/", todos);

/**
 * @swagger
 * /usuarios/{idUsuario}:
 *   get:
 *     summary: Obtiene un usuario por su ID
 *     tags: [usuarios]
 *     parameters:
 *       - in: path
 *         name: idUsuario
 *         description: ID del usuario a obtener
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Usuario obtenido correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Usuario'
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error interno del servidor
 */

router.get("/:idUsuario", uno);
/**
 * @swagger
 * /usuarios:
 *   post:
 *     summary: Agrega un nuevo usuario a la base de datos
 *     tags: [usuarios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Usuario'
 *     responses:
 *       200:
 *         description: Nuevo usuario creado en la base de datos
 *       400:
 *         description: Error en la solicitud o formato de datos incorrecto
 *       500:
 *         description: Error interno del servidor
 */
router.post("/", agregar);

/**
 * @swagger
 * /usuarios:
 *   put:
 *     summary: Ellimina un usuario existente en la base de datos
 *     tags: [usuarios]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Usuario'
 *     responses:
 *       200:
 *         description: Usuario eliminado correctamente en la base de datos
 *       400:
 *         description: Error en la solicitud o formato de datos incorrecto
 *       401:
 *         description: No autorizado, token de acceso no válido
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error interno del servidor
 */

router.put("/", seguridad(), eliminar);

async function todos(req, res, next) {
  try {
    const items = await controlador.todos();
    respuesta.success(req, res, items, 200);
  } catch (err) {
    next(err);
  }
}

async function uno(req, res, next) {
  try {
    const items = await controlador.uno(req.params.idUsuario);
    respuesta.success(req, res, items, 200);
  } catch (err) {
    next(err);
  }
}

async function eliminar(req, res, next) {
  try {
    const items = await controlador.eliminar(req.body);
    respuesta.success(req, res, "Item eliminado con exito", 200);
  } catch (err) {
    next(err);
  }
}

// Función para generar un ID automático único
function generarIdAutomatico() {
  const maxId = 99999; // Máximo número de 10 dígitos
  const minId = 1; // Mínimo número de 10 dígitos
  const id = Math.floor(Math.random() * (maxId - minId + 1)) + minId;

  console.log("ID generado:", id); // Imprimir el ID generado en la consola

  return id;
}

async function agregar(req, res, next) {
  try {
    const { nombre, usuario, password, rol } = req.body;
    let idUsuario = req.body.idUsuario || generarIdAutomatico(); // Generar un ID automáticamente si no se proporciona uno

    // Asegúrate de que el rol enviado sea "admin" o "vendedor"
    if (rol !== "admin" && rol !== "vendedor") {
      return respuesta.error(
        req,
        res,
        'Rol inválido. Debe ser "admin" o "vendedor"',
        400
      );
    }

    const items = await controlador.agregar({ ...req.body, idUsuario }); // Incluir el ID generado en la solicitud al controlador
    let mensaje;
    
    if (req.body.idUsuario) {
      mensaje = "Item actualizado con éxito";
    } else {
      mensaje = "Item guardado con éxito";
    }
    respuesta.success(req, res, mensaje, 201);
  } catch (err) {
    if (err.message === 'El usuario ya existe') {
        respuesta.error(req, res, err.message, 400);
    } else {
        next(err);
    }
}
}

module.exports = router;
