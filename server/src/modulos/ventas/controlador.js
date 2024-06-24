module.exports = function(dbInyectada) {
    let db = dbInyectada;
    if (!db) {
        db = require('../../DB/ventasMysql.js');
    }

    function todos (){
        return db.todos();
    }
    
    async function agregar(datosVenta) {
        try {
            console.log('Datos de venta recibidos en el controlador.js:', datosVenta)
            await db.agregar(datosVenta);
            // La venta se ha insertado correctamente
            return 'La venta se ha agregado correctamente';
        } catch (error) {
            // Maneja cualquier error que pueda ocurrir durante el proceso
            throw error;
        }
    }

    function uno(id) {
        return db.uno(id);
    }

  

    function actualizar(id, body) {
        return db.actualizar(id, body);
    }

    function eliminar(id) {
        return db.eliminar(id); // Llama a la función eliminarVenta del módulo db
    }

    return {
        todos,
        agregar,
        uno,
        actualizar,
        eliminar,
        
    };
};
