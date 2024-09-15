const express = require('express');
const respuesta = require('../../red/respuestas');
const controlador = require('./index');

const router = express.Router();

// Ruta de inicio de sesión en el servidor
router.post('/login', login);

// Rutas CRUD para usuarios
router.post('/usuario', addUser);
router.get('/usuario/:usuario', getUser);
router.get('/', todos); // Nueva ruta para obtener todos los usuarios
router.put('/usuario/nombre/:usuario', actualizar); // Cambia a nombre de usuario para la actualización
router.delete('/usuario/nombre/:usuario', eliminarPorNombre);

async function login(req, res, next) {
    try {
      const result = await controlador.login(req.body.usuario, req.body.password);
      console.log('Resultado del login:', result);
  
      // Enviar el token, idUsuario, usuario y rol al cliente como respuesta
      respuesta.success(req, res, { body: result }, 200);
    } catch(err) {
      next(err);
    }
  }
  
async function addUser(req, res, next) {
    try {
        const data = req.body;
        const result = await controlador.agregar(data);
        respuesta.success(req, res, result, 201);
    } catch (err) {
        next(err);
    }
}

async function getUser(req, res, next) {
    try {
        const { usuario } = req.params;
        const result = await controlador.obtenerPorUsuario(usuario);
        respuesta.success(req, res, result, 200);
    } catch (err) {
        next(err);
    }
}

async function todos(req, res, next) {
    console.log(req);
    try {
        const usuarios = await controlador.todos();
        respuesta.success(req, res, usuarios, 200);
    } catch (err) {
        next(err);
    }
}

async function eliminarPorNombre(req, res, next) {
    try {
        const { usuario } = req.params;
        await controlador.eliminarPorNombre(usuario);
        respuesta.success(req, res, 'Usuario eliminado con éxito', 200);
    } catch (err) {
        next(err);
    }
}

async function actualizar(req, res, next) {
    try {
        const { usuario } = req.params;
        const data = req.body;
        await controlador.actualizarPorUsuario(usuario, data);
        respuesta.success(req, res, 'Usuario actualizado con éxito', 200);
    } catch (err) {
        next(err);
    }
}
module.exports = router;