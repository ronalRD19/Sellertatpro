const TABLA =  'clientes';

module.exports = function(dbInyectada) {

    let db = dbInyectada;
        if (!db){
            db = require ('../../DB/clientesMysql');
        }


    function todos (){
        return db.todos(TABLA);
    
    }
    
    function buscarPorNombre(nombreCliente) {
        return db.buscarPorNombre(nombreCliente);
        }

    function buscarPorCedula(cedulaCliente) {
         return db.buscarPorNombre(cedulaCliente);
        }
    
        async function agregar(data) {
            try {
                console.log("Intentando agregar cliente:", data.cedula);
                const clientesExistentes = await buscarPorCedula(data.cedula);
                console.log("Clientes existentes:", clientesExistentes);
        
                if (clientesExistentes.length > 0) {
                    throw new Error("El cliente ya existe en la base de datos.");
                }
        
                console.log("Cliente agregado con éxito");
                const resultado = await db.agregar(TABLA, data);
                return resultado;
            } catch (error) {
                console.error("Error al agregar el cliente:", error);
                throw error;
            }
        }
    
    async function actualizar(idCliente, body) {
        return db.actualizar(TABLA, idCliente, body);
    }
    
    function eliminar (idCliente){
        return db.eliminar(TABLA, idCliente);
    
    }
    function buscarPorIdCliente(idCliente) {
        return db.buscarPorIdCliente(idCliente);
    }
    

    return{ 
    todos,
    buscarPorNombre,
    buscarPorCedula,
    buscarPorIdCliente,
    agregar,
    actualizar,
    eliminar,
}

}