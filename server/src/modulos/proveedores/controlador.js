const TABLA =  'proveedores';

module.exports = function(dbInyectada) {

    let db = dbInyectada;
        if (!db){
            db = require ('../../DB/proveedoresMysql');
        }


    function todos (){
        return db.todos(TABLA);
    
    }
    
    function buscarPorNombre(nombreProveedores) {
        return db.buscarPorNombre(nombreProveedores);
        }
    
    function agregar (body){
        return db.agregar(TABLA, body);
    
    }
    
    async function actualizar(idProveedor, body) {
        return db.actualizar(TABLA, idProveedor  , body);
    }
    
    function eliminar (idProveedor){
        return db.eliminar(TABLA, idProveedor );
    
    }

    return{ 
    todos,
    buscarPorNombre,
    agregar,
    actualizar,
    eliminar,
}

}