const mysql = require('mysql2/promise');
const config = require('../config');

const dbconfig = {
    host: config.mysql.host,
    user: config.mysql.user,
    password: config.mysql.password,
    database: config.mysql.database,
};

let conexion; // Variable global para la conexión

async function crearConexion() {
    try {
        conexion = await mysql.createConnection(dbconfig); // Asigna la conexión a la variable global
        console.log('Conexión a la base de datos establecida correctamente');
    } catch (error) {
        console.error('Error al conectar a la base de datos:', error);
        throw error;
    }

    // Manejo de eventos después de que se establezca la conexión
    conexion.on('error', err => {
        console.log('[db err]', err);
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            crearConexion(); // Vuelve a intentar conectarse
        } else {
            throw err;
        }
    });
}

crearConexion(); // Inicializa la conexión


async function agregar(datosVenta) {
    try {
        await crearConexion(); // No necesitas asignarlo a una variable local
        console.log('Datos de venta recibidos en la consulta:', datosVenta);

        const { fechaVenta, montoTotal, cantidadTotal, idCliente, idUsuario, productos } = datosVenta;

        const insertVentaQuery = 'INSERT INTO ventas (fechaVenta, montoTotal, cantidadTotal, idCliente, idUsuario) VALUES (?, ?, ?, ?, ?)';
        const [insertVentaResult] = await conexion.execute(insertVentaQuery, [fechaVenta, montoTotal, cantidadTotal, idCliente, idUsuario]);

        const idVenta = insertVentaResult.insertId;
        console.log('ID de la venta insertada:', idVenta);

        for (const producto of productos) {
            const { idProducto,  cantidad } = producto;
            const insertDetalleVentaQuery = 'INSERT INTO detalleventas (idVenta, idProducto, cantidad) VALUES (?, ?, ?)';
            await conexion.execute(insertDetalleVentaQuery, [idVenta, idProducto, cantidad]);
        }

        await conexion.end();
        
        return 'La venta se ha agregado correctamente';
    } catch (error) {
        throw new Error('Error al agregar nueva venta: ' + error.message);
    }
}




async function todos() {
    try {
        await crearConexion(); // No necesitas asignarlo a una variable local

        const selectVentasQuery = 'SELECT * FROM ventas';
        const [ventas] = await conexion.execute(selectVentasQuery);

        const ventasConProductos = [];

        for (const venta of ventas) {
            const selectProductosQuery = `
                SELECT productos.* 
                FROM detalleventas 
                INNER JOIN productos ON detalleventas.idProducto = productos.idProducto 
                WHERE detalleventas.idVenta=?
            `;
            const [productos] = await conexion.execute(selectProductosQuery, [venta.idVenta]);
            ventasConProductos.push({ ...venta, productos });
        }

        await conexion.end();

        return ventasConProductos;
    } catch (error) {
        throw new Error('Error al obtener todas las ventas: ' + error.message);
    }
}

function uno(id) {
    return new Promise(async (resolve, reject) => {
        try {
            await crearConexion(); // No necesitas asignarlo a una variable local

            const selectVentaQuery = 'SELECT * FROM ventas WHERE idVenta = ?';
            const [venta] = await conexion.execute(selectVentaQuery, [id]);

            if (!venta || venta.length === 0) {
                resolve(null); // Si no se encuentra la venta, resolvemos con null
                return;
            }

            const selectProductosQuery = `
                SELECT productos.* 
                FROM detalleventas 
                INNER JOIN productos ON detalleventas.idProducto = productos.idProducto 
                WHERE detalleventas.idVenta=?
            `;
            const [productos] = await conexion.execute(selectProductosQuery, [id]);

            await conexion.end();

            // Devolvemos la venta y los productos asociados
            resolve({ venta: venta[0], productos });
        } catch (error) {
            reject(error);
        }
    });
}

async function actualizar(idVenta, datosVenta) {
    try {
        await crearConexion(); // No necesitas asignarlo a una variable local
        console.log('Datos de venta recibidos en la actualización:', datosVenta);

        const { fechaVenta, montoTotal, cantidadTotal, idCliente, idUsuario, productos } = datosVenta;

        // Actualizar la venta principal
        const updateVentaQuery = 'UPDATE ventas SET fechaVenta=?, montoTotal=?, cantidadTotal=?, idCliente=?, idUsuario=? WHERE idVenta=?';
        await conexion.execute(updateVentaQuery, [fechaVenta, montoTotal, cantidadTotal, idCliente, idUsuario, idVenta]);

        // Eliminar los detalles de venta existentes para esta venta
        const deleteDetalleVentaQuery = 'DELETE FROM detalleventas WHERE idVenta=?';
        await conexion.execute(deleteDetalleVentaQuery, [idVenta]);

        // Insertar los nuevos detalles de venta
        for (const producto of productos) {
            const { idProducto, cantidad } = producto;
            const insertDetalleVentaQuery = 'INSERT INTO detalleventas (idVenta, idProducto, cantidad) VALUES (?, ?, ?)';
            await conexion.execute(insertDetalleVentaQuery, [idVenta, idProducto, cantidad]);
        }

        await conexion.end();
        
        return 'La venta se ha actualizado correctamente';
    } catch (error) {
        throw new Error('Error al actualizar la venta: ' + error.message);
    }
}

async function eliminar(idVenta) {
    try {
        await crearConexion(); // No necesitas asignarlo a una variable local

        // Eliminar la venta de la tabla 'ventas'
        const eliminarVentaQuery = 'DELETE FROM ventas WHERE idVenta = ?';
        await conexion.execute(eliminarVentaQuery, [idVenta]);

        // Eliminar los detalles de la venta de la tabla 'detalleventas'
        const eliminarDetallesQuery = 'DELETE FROM detalleventas WHERE idVenta = ?';
        await conexion.execute(eliminarDetallesQuery, [idVenta]);

        await conexion.end();
        
        return 'La venta se ha eliminado correctamente';
    } catch (error) {
        throw new Error('Error al eliminar venta: ' + error.message);
    }
}


function query(tabla, consulta) {
    return new Promise((resolve, reject) => {
        conexion.query(`SELECT * FROM ${tabla} WHERE ?`, consulta, (error, result) => {
            if (error) {
                reject(error);
            } else {
                resolve(result);
            }
        });
    });
}

module.exports = {
    agregar,
    todos,
    uno,
    actualizar,
    eliminar,
    query,
    cerrarConexion: () => {
        conexion.end(err => {
            if (err) {
                console.log('[db err]', err);
            } else {
                console.log('Conexión a MySQL cerrada');
            }
        });
    }
};
