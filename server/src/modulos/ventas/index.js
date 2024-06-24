const db = require('../../DB/ventasMysql');
const ctrl = require('./controlador');

module.exports = ctrl(db);