const jwt = require('jsonwebtoken');
const moment = require('moment');
config = require('../config');


const secret = config.jwt.secret;

// Generar token JWT
function asignarToken(data){
     // Crear un payload con la información del usuario
    const payload ={
        sub: data._idUsuario,
        iat: moment().unix(), // Fecha de emisión del token
        exp: moment().add(14, 'days').unix(), // Fecha de expiración del token
    }
    // Firmar el token con la clave secreta
    return jwt.sign(payload, secret);
}

function verificarToken(token){
    return jwt.verify(token, secret);
}

const chequearToken = {
    confirmarToken: function(req){
        const decoficado = decodificarCabecera(req);

       if(decoficado.idUsuario !== idUsuario){
            throw new Error("No tienes privilegios para hacer esto")
        }
    }
}

function obtenerToken (autorizacion){
    if(!autorizacion){
        throw new Error ('No viene token');
    }
    if(autorizacion.indexOf('Bearer') === -1){
      throw new Error ('Formato invalido')  
    }

    let token = autorizacion.replace('Bearer ', '')
    return token;
}

function decodificarCabecera(req){
    const autorizacion = req.headers.authorization || '';
    const token = obtenerToken(autorizacion);
    const  decodificado = verificarToken(token);

    req.user = decodificado;

    return decodificado;
}




module.exports = {
    asignarToken,
   
}