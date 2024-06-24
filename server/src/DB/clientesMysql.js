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

function buscarPorNombre(nombreCliente) {
    return new Promise((resolve, reject) => {
    conexion.query(`SELECT * FROM clientes WHERE nombre LIKE ?`, [`%${nombreCliente}%`], (error, result) => {
        return error ? reject(error) : resolve(result);
    });
    });
}
function buscarPorCedula(cedulaCliente) {
    return new Promise((resolve, reject) => {
        conexion.query('SELECT * FROM clientes WHERE cedula = ?', [cedulaCliente], (error, results) => {
            if (error) {
                return reject(error);
            }
            resolve(results);
        });
    });
}

function agregar(tabla, data) {
    return new Promise((resolve, reject) => {
        conexion.query(`INSERT INTO ${tabla} SET ?`, [data], (error, result) => {
            if (error) {
                if (error.code === 'ER_DUP_ENTRY') {
                    return reject(new Error('El cliente ya existe en la base de datos.'));
                }
                return reject(error);
            }
            resolve(result);
        });
    });
}
function actualizar(tabla, id, data) {
    return new Promise((resolve, reject) => {
        conexion.query(`UPDATE ${tabla} SET ? WHERE idCliente = ?`, [data, id], (error, result) => {
            return error ? reject(error) : resolve(result);
        });
    });
}

function eliminar(tabla, id) {
    console.log(id);
    return new Promise((resolve, reject) => {
        conexion.query(`DELETE FROM ${tabla} WHERE idCliente = ?`, [id], (error, result) => {
            if (error) {
                reject(error);
            } else {
                resolve(result);
            }
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

module.exports = {
    todos,
    buscarPorNombre,
    buscarPorCedula,
    agregar,
    eliminar,
    actualizar,
    query
};