const request = require('supertest');
const express = require('express');
const clienteRoutes = require('./rutas'); // Asegúrate de que esta ruta sea correcta

const app = express();
app.use(express.json());
app.use('/clientes', clienteRoutes);

let server;

beforeAll((done) => {
  server = app.listen(done);
});

afterAll((done) => {
  server.close(done);
});

describe('Clientes API', () => {
  test('debería crear un nuevo cliente', async () => {
    const newClient = {
      nombre: "Erik Manuel",
      direccion: "Manzana 12 lote 26",
      telefono: "3112742475",
      cedula: "02785264523"
    };

    const response = await request(app)
      .post('/clientes')
      .send(newClient)
      .set('Content-Type', 'application/json');

    expect(response.status).toBe(201);
    const responseBody = response.body;
    expect(responseBody.body).toBe('Cliente guardado con éxito'); 
  });

  test('debería obtener todos los clientes', async () => {
    const response = await request(app)
      .get('/clientes')
      .set('Accept', 'application/json');

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body.body)).toBe(true);
    console.log(response.body);
  });

  test('debería obtener un cliente por nombre', async () => {
    const nombreCliente = 'CARLOS';
    const response = await request(app)
        .get(`/clientes/${nombreCliente}`)
        .set('Accept', 'application/json');

    expect(response.status).toBe(200);

    if (response.status === 200) {
        const responseBody = response.body.body;
        
        // Verificar que se encuentre al menos un cliente y que tenga la propiedad 'nombre'
        expect(responseBody.length).toBeGreaterThan(0);
        responseBody.forEach(cliente => {
            expect(cliente).toHaveProperty('nombre', nombreCliente);
            console.log('Clientes encontrados:', responseBody);
        });
    } else if (response.status === 404) {
        expect(response.body.message).toBe('Cliente no encontrado');
    }
});

  test('debería obtener un cliente por cédula', async () => {
    const cedulaCliente = '1192794431';
    const response = await request(app)
      .get(`/clientes/cedula/${cedulaCliente}`)
      .set('Accept', 'application/json');
  
    expect(response.status).toBe(200);
    const responseBody = response.body.body[0]; // Acceder al primer elemento del array
    expect(responseBody.cedula).toBe(cedulaCliente);
    console.log("Cliente encontrado:", responseBody);
  });

  test('debería actualizar un cliente existente', async () => {
    const idCliente = 9; // Asegúrate de que este ID existe en tu base de datos
    const updatedClient = {
      nombre: "Fabio Actualizado 3",
      direccion: "Nueva Direccion 123",
      telefono: "3112742475",
      cedula: "3112742475"
    };

    const response = await request(app)
      .put(`/clientes/${idCliente}`)
      .send(updatedClient)
      .set('Content-Type', 'application/json');

    expect(response.status).toBe(200);
    expect(response.body.body).toBe('Item actualizado con éxito');
  });

  test('debería eliminar un cliente existente', async () => {
    const idCliente = 111; // Asegúrate de que este ID existe en tu base de datos

    const response = await request(app)
      .delete(`/clientes/${idCliente}`)
      .set('Accept', 'application/json');

    expect(response.status).toBe(200);
    expect(response.body.body).toBe('Elemento eliminado con éxito');
  });
});