const db = require('../../DB/clientesMysql');
const ctrl = require('./controlador');

module.exports = ctrl(db);