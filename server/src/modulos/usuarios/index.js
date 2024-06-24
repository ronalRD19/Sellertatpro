const db = require('../../DB/usuariosmysql');
const ctrl = require('./controlador');

module.exports = ctrl(db);