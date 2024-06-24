const TABLA = 'productos';

module.exports = function (dbInyectada) {
    let db = dbInyectada;
    if (!db) {
        db = require('../../DB/productosMysql');
    }

    function todos() {
        return db.todos(TABLA);
    }

    function buscarPorNombre(nombreProducto) {
        return db.buscarPorNombre(nombreProducto);
        }

    function buscarPorIdProducto(id) {
        console.log(id);
        return db.buscarPorIdProducto(id);
    }


    // Utiliza esta función para agregar productos, verificando duplicidad antes de la inserción
    async function agregar(productoData) {
        try {
            console.log("Intentando agregar producto:", productoData.nombre);
            const productosExistentes = await buscarPorNombre(productoData.nombre);
            
            console.log("Productos existentes:", productosExistentes);
    
            if (productosExistentes.length > 0) {
                throw new Error("El producto ya existe en la base de datos.");
            } 
                console.log("Producto agregado con éxito");
                const resultado = await db.agregar(TABLA, productoData);  
                return resultado;
            

        } catch (error) {
            console.error("Error al agregar el producto:", error);
            throw error; // Continuar propagando el error para que pueda ser manejado en otra parte
        }
    }

    async function actualizar(idProducto, body) {
        return db.actualizar(TABLA, idProducto, body);
    }

    function eliminar(idProducto) {
        return db.eliminar(TABLA, idProducto);
    }


    return {
        todos,
        buscarPorNombre,
        agregar,  // Solo mantiene la lógica de verificación dentro de esta función de agregar
        actualizar,
        eliminar,
        buscarPorIdProducto
        
    };
}