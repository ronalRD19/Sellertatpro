const swaggerJSDOC= require ("swagger-jsdoc");
const swaggerUI = require ("swagger-ui-express");

const options = {
    definition:{
        openapi:"3.0.0",
        info:{
        title:"Api nodeSeller",
        version:"1.0.0",
        descrpcion: "Ejemplo conectandose a Mysql y separando las rutas",
        contact:{
          name: "Api support",
          url:"",
          email:"supportADSO@example.com",
        },
    },

    servers:[
        {
            url:"http://localhost:3001",
            descrpcion:"documentacion de mi api Rest ColectionHot",
        },
    ],

},
    apis:["src/modulos/productos/rutas.js", "src/modulos/ventas/rutas.js","src/modulos/proveedores/rutas.js","src/modulos/usuarios/rutas.js","src/modulos/clientes/rutas.js","src/modulos/facturasCompra/rutas.js","src/modulos/detallesCompras/rutas.js","src/modulos/detallesVentas/rutas.js"],
    
    
    
    
}

const swagerSpec = swaggerJSDOC(options);
const swaggerJSDOCs = (app, port) =>{
    app.use("/api/docs", swaggerUI.serve, swaggerUI.setup(swagerSpec));
    app.get("/api/docs.json",(req,res)=>{
        res.setHeader('Content-Type', 'application/json');
        res.send(swagerSpec);
});
 console.log(
    'Version No 1 de la documentacion estara disponible en http://localhost:${port}/api-docs'
);
};

/*export default swaggerJSDOCs;*/
module.exports = swaggerJSDOCs;