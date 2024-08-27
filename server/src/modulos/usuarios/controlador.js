const auth = require('../auth'); // Este módulo maneja la autenticación

const TABLA_USUARIOS = 'usuarios';
const TABLA_AUTH = 'autenticacion'; // Esta tabla maneja la autenticación

module.exports = function(dbInyectada) {
    let db = dbInyectada;
    if (!db) {
        db = require('../../DB/usuariosmysql');
    }

    function todos() {
        return db.todos(TABLA_USUARIOS);
    }

    function uno(idUsuario) {
        return db.uno(TABLA_USUARIOS, idUsuario);
    }

    async function agregar(body) {
        // Verifica si el nombre de usuario ya existe en la tabla de autenticación
        const usuarioExistente = await db.buscarPorCampo(TABLA_AUTH, 'usuario', body.usuario);
        if (usuarioExistente.length > 0) {
            throw new Error('El usuario ya existe');
        }

        const usuario = {
            idUsuario: body.idUsuario,
            nombre: body.nombre
        };

        // Agrega el usuario a la tabla de usuarios
        const respuesta = await db.agregar(TABLA_USUARIOS, usuario);
        console.log('respuesta', respuesta);
        let insertId = 0;
        if (body.idUsuario == 0) {
            insertId = respuesta.insertId;
        } else {
            insertId = body.idUsuario;
        }

        let respuesta2 = '';
        if (body.usuario && body.password) {
            // Agrega la autenticación a la tabla correspondiente
            respuesta2 = await auth.agregar({
                idUsuario: insertId,
                usuario: body.usuario,
                password: body.password,
                rol: body.rol
            });
        }
        return respuesta2;
    }

    function eliminar(body) {
        return db.eliminar(TABLA_USUARIOS, body);
    }

    return {
        todos,
        uno,
        agregar,
        eliminar
    };
};
