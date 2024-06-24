const express = require('express');
const multer = require('multer');
const path = require('path');
const respuesta = require('../../red/respuestas');
const controlador = require('./index');
const db = require('../../DB/productosMysql');

const app = express();

// Configurar multer para manejar la carga de archivos
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../uploads')); 
  },
  filename: function (req, file, cb) {
    // Generar un nombre único para el archivo basado en la marca de tiempo y el nombre original del archivo
    const uniqueName = Date.now() + '-' + file.originalname;
    cb(null, uniqueName);
  }
});

// Crear un middleware de multer con la configuración de almacenamiento
const upload = multer({ storage: storage });



/**
 * @swagger
 * components:
 *  schemas:
 *   productos:
 *    type: object
 *    properties:
 *      id:
 *          type: integer
 *          description: Id autogenerado en la BdD
 *      nombre:
 *          type: string
 *          description: Nombre del producto
 *      precio:
 *          type: integer
 *          description: Precio del producto
 *      stock:
 *          type: integer
 *          description: Cantidad en stock del producto
 *      idProveedores:
 *          type: integer
 *          description: Clave de conexión con la tabla proveedores
 *    required:
 *      - id
 *      - nombre
 *      - precio
 *      - stock
 *      - idProveedores
 */

/**
 * @swagger
 * /productos:
 *      get:
 *          summary: Retorna todos los registros de la entidad productos
 *          tags: [productos]
 *          responses:
 *           200:
 *               description: Esta es la lista de los productos en la BdD
 *               content:
 *                   application/json:
 *                       schema:
 *                           type: array
 *                           items:
 *                            $ref: '#/components/schemas/productos'
 * 
 */
// Rutas para manejar las solicitudes relacionadas con los productos
app.get('/', todos);
/**
 * @swagger
 * /productos/{id}:
 *   get:
 *     summary: Obtiene un producto por su ID
 *     tags: [productos]
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID del producto a obtener
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Producto obtenido correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Producto'
 *       404:
 *         description: Producto no encontrado
 *       500:
 *         description: Error interno del servidor
 */
app.get('/:nombreProducto', buscarPorNombre);
app.get('/idProducto/:id', buscarPorIdProducto);
  /**
   * @swagger
   * /productos:
   *   post:
   *     summary: Agrega un nuevo producto a la base de datos
   *     tags: [productos]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/Producto'
   *     consumes:
   *       - multipart/form-data
   *     parameters:
   *       - in: formData
   *         name: imagenProducto
   *         description: Imagen del producto
   *         required: true
   *         type: file
   *     responses:
   *       200:
   *         description: Nuevo producto creado en la base de datos
   *       400:
   *         description: Error en la solicitud o formato de datos incorrecto
   *       500:
   *         description: Error interno del servidor
   */
app.post('/', upload.single('imagenProducto'), agregar); // Usar multer para manejar la carga de imágenes
/**
 * @swagger
 * /productos/{id}:
 *   put:
 *     summary: Actualiza un producto por su ID
 *     tags: [productos]
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID del producto a actualizar
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProductoInput' # Reemplaza 'ProductoInput' con el nombre correcto del esquema para la entrada de datos del producto
 *     responses:
 *       200:
 *         description: Producto actualizado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Producto' # Reemplaza 'Producto' con el nombre correcto del esquema del producto
 *       404:
 *         description: Producto no encontrado
 *       500:
 *         description: Error interno del servidor
 */
app.put('/:idProducto', actualizar);
/**
 * @swagger
 * /productos/{id}:
 *   delete:
 *     summary: Eliminar un producto de la BdD
 *     tags: [productos]
 *     parameters:
 *       - in: path
 *         name: id
 *         description: Código del producto a eliminar
 *         schema:
 *           type: integer
 *           required: true
 *     responses:
 *       200:
 *         description: Producto eliminado de la BdD
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               $ref: '#/components/schemas/productos'
 *       404:
 *         description: No se encuentra en la lista de los productos de la BdD
 */

app.delete('/:idProducto', eliminar);

async function todos(req, res, next) {
  try {
    const productos = await controlador.todos();
    // Iterar sobre los productos y agregar la URL de la imagen a cada uno
    const productosConImagenes = productos.map(producto => ({
      ...producto,
      imagenUrl: `${producto.imagenProducto}`
    }));
    respuesta.success(req, res, productosConImagenes, 200);
  } catch (err) {
    next(err);
  }
}

async function buscarPorNombre(req, res, next) {
  try {
    const nombreProducto = req.params.nombreProducto;
    const productos = await db.buscarPorNombre(nombreProducto);
    respuesta.success(req, res, productos, 200);
  } catch (err) {
    next(err);
  }
}
async function buscarPorIdProducto(req, res, next) {
  try {
    const id = req.params.id;
    const productoID = await db.buscarPorIdProducto(id);
    respuesta.success(req, res, productoID, 200);
  } catch (err) {
    next(err);
  }
}


async function agregar(req, res, next) {
  try {
      const { nombre, precio, stock, idProveedor } = req.body;
      const imagenProducto = req.file.filename;
      const productoData = { nombre, precio, stock, idProveedor, imagenProducto };
      await controlador.agregar(productoData);
      res.status(200).send("Producto agregado exitosamente");
  } catch (err) {
      if (err.message && err.message.includes("ya existe")) {
          res.status(400).send("El producto ya existe en la base de datos.");
      } else {
          console.error("Error interno del servidor:", err);
          res.status(500).send("Error interno del servidor");
      }
  }
}
async function actualizar(req, res, next) {
  try {
    const idProducto = req.params.idProducto; // Obtener el ID del parámetro de la URL
    const { nombre, precio, stock, idProveedor, imagenProducto } = req.body; // Obtener los datos actualizados del producto
    const items = await controlador.actualizar(idProducto, { nombre, precio, stock, idProveedor, imagenProducto }); // Llamar al controlador para actualizar el elemento
    respuesta.success(req, res, 'Item actualizado con éxito', 200); // Responder con éxito
  } catch (err) {
    next(err); // Pasar cualquier error al siguiente middleware
  }
}

async function eliminar(req, res, next) {
  try {
    // Obtener el ID del producto desde los parámetros de la ruta
    const idProducto = req.params.idProducto;

    // Llamar al método del controlador para eliminar el elemento
    await controlador.eliminar(idProducto);

    // Enviar una respuesta de éxito
    respuesta.success(req, res, 'Elemento eliminado con éxito', 200);
  } catch (err) {
    // Pasar el control al siguiente middleware de manejo de errores
    next(err);
  }
}

module.exports = app;