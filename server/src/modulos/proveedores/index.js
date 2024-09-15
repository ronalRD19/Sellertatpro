const db = require('../../DB/proveedoresMysql');
const ctrl = require('./controlador');

module.exports = ctrl(db);