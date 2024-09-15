const TABLA = 'autenticacion';
const bcrypt = require('bcrypt');
const auth = require('../../auth');
const error = require('../../middleware/errors');

module.exports = function (dbInyectada) {
    let db = dbInyectada;
    if (!db) {
        db = require('../../DB/usuariosmysql');
    }

    async function login(usuario, password) {
        console.log('Usuario recibido:', usuario); // Agrega este registro de depuración
        console.log('Contraseña recibida:', password);
        const data = await db.query(TABLA, { usuario: usuario }); // Verificar las credenciales del usuario en la base de datos
        console.log('Datos obtenidos de la base de datos:', data);

        if (!data || !Array.isArray(data) || data.length === 0) {
            throw new Error('Usuario no encontrado');
        }

        const userData = data[0];

        const passwordMatch = await bcrypt.compare(password, userData.password);
        if (passwordMatch) {
            const token = auth.asignarToken({ ...userData });
            return {
                idUsuario: userData.idUsuario,
                usuario: userData.usuario,
                rol: userData.rol,
            };
        } else {
            throw new Error('Contraseña incorrecta');
        }
    }

    async function agregar(data) {
        const authData = {
            idUsuario: data.idUsuario,
            usuario: data.usuario,
            rol: data.rol
        };
        if (data.password) {
            authData.password = await bcrypt.hash(data.password.toString(), 7);
        }
        return db.agregar(TABLA, authData);
    }

    async function obtenerPorUsuario(usuario) {
        const data = await db.query(TABLA, { usuario: usuario });

        if (!data || !Array.isArray(data) || data.length === 0) {
            throw new Error('Usuario no encontrado');
        }

        return data[0];
    }

    function todos() {
        return db.todos(TABLA);
    }

    async function eliminarPorNombre(usuario) {
        const result = await db.eliminarPorNombre(TABLA, { usuario: usuario });

        if (!result) {
            throw new Error('Error al eliminar el usuario');
        }

        return { message: 'Usuario eliminado correctamente' };
    }

    async function actualizarPorUsuario(usuario, data) {
        return db.actualizarPorUsuario(TABLA, usuario, data);
    }

    return {
        agregar,
        login,
        obtenerPorUsuario,
        todos,
        eliminarPorNombre,
        actualizarPorUsuario
    };
};