const mysql = require('mysql');
const config = require('../config');

const dbconfig = {
    host: config.mysql.host,
    user: config.mysql.user,
    password: config.mysql.password,
    database: config.mysql.database,
};

let conexion;

function conMysql() {
    conexion = mysql.createConnection(dbconfig);

    conexion.connect((err) => {
        if (err) {
            console.log('[db err]', err);
            setTimeout(conMysql, 200);
        } else {
            console.log('DB connected');
        }
    });

    conexion.on('error', err => {
        console.log('[db err]', err);
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            conMysql();
        } else {
            throw err;
        }
    });
}

conMysql();

function todos(tabla) {
    return new Promise((resolve, reject) => {
        conexion.query(`SELECT * FROM ${tabla}`, (error, result) => {
            return error ? reject(error) : resolve(result);
        });
    });
}

function buscarPorNombre(nombreProveedores) {
    return new Promise((resolve, reject) => {
        conexion.query(`SELECT * FROM proveedores WHERE nombre LIKE ?`, [`%${nombreProveedores}%`], (error, result) => {
            return error ? reject(error) : resolve(result);
        });
    });
}

function buscarPorCampo(tabla, campo, valor) {
    return new Promise((resolve, reject) => {
        const query = `SELECT * FROM ${tabla} WHERE ${campo} = ?`;
        conexion.query(query, [valor], (err, results) => { // Cambiado db.query a conexion.query
            if (err) return reject(err);
            resolve(results);
        });
    });
}

function agregar(tabla, data) {
    return new Promise((resolve, reject) => {
        conexion.query(`INSERT INTO ${tabla} SET ? ON DUPLICATE KEY UPDATE ?`, [data, data], (error, result) => {
            return error ? reject(error) : resolve(result);
        });
    });
}

function actualizar(tabla, id, data) {
    return new Promise((resolve, reject) => {
        conexion.query(`UPDATE ${tabla} SET ? WHERE idUsuario = ?`, [data, id], (error, result) => {
            return error ? reject(error) : resolve(result);
        });
    });
}

function actualizarPorUsuario(tabla, usuario, data) {
    return new Promise((resolve, reject) => {
        conexion.query(`UPDATE ${tabla} SET ? WHERE usuario = ?`, [data, usuario], (error, result) => {
            return error ? reject(error) : resolve(result);
        });
    });
}

function eliminarPorNombre(tabla, usuario) {
    return new Promise((resolve, reject) => {
        conexion.query(`DELETE FROM ${tabla} WHERE ?`, usuario, (error, result) => {
            return error ? reject(error) : resolve(result);
        });
    });
}

function query(tabla, consulta) {
    return new Promise((resolve, reject) => {
        conexion.query(`SELECT * FROM ${tabla} WHERE ?`, consulta, (error, result) => {
            return error ? reject(error) : resolve(result);
        });
    });
}


function uno(tabla, idUsuario) {
    return new Promise((resolve, reject) => {
        conexion.query(`SELECT * FROM ${tabla} WHERE idUsuario = ?`, [idUsuario], (error, result) => {
            if (error) {
                return reject(error);
            }
            if (result.length === 0) {
                return reject(new Error('Usuario no encontrado'));
            }
            resolve(result[0]);
        });
    });
}

module.exports = {
    todos,
    buscarPorNombre,
    buscarPorCampo,
    agregar,
    eliminarPorNombre,
    actualizar,
    actualizarPorUsuario,
    uno,
    query
};
