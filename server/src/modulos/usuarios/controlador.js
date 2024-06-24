const auth = require('../auth');

const TABLA =  'usuarios';

module.exports = function(dbInyectada) {

    let db = dbInyectada;
        if (!db){
            db = require ('../../DB/usuariosmysql');
        }


    function todos (){
        return db.todos(TABLA);
    
    }
    
    function uno (idUsuario){
        return db.uno(TABLA, idUsuario);
    
    }
    
    
    async function agregar(body) {
        const usuario = {
            idUsuario: body.idUsuario,
            nombre: body.nombre
        };
    
        const respuesta = await db.agregar(TABLA, usuario);
        console.log('respuesta', respuesta);
        let insertId = 0;
        if (body.idUsuario == 0) {
            insertId = respuesta.insertId;
        } else {
            insertId = body.idUsuario;
        }
    
        let respuesta2 = '';
        if (body.usuario && body.password) {
            respuesta2 = await auth.agregar({
                idUsuario: insertId,
                usuario: body.usuario,
                password: body.password,
                rol: body.rol
            });
        }
        return respuesta2;
    }
    
    function eliminar (body){
        return db.eliminar(TABLA, body);
    
    }

    return{ 
    todos,
    uno,
    agregar,
    eliminar,
}

}