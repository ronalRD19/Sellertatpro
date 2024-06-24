import React from 'react';
import './FacturaVenta.css'; // Importa el archivo CSS para el estilo de la factura

const FacturaVenta = ({ venta }) => {
  return (
    <div className="factura-venta">
      <h1>Factura de Venta</h1>
      <p><strong>Fecha de Venta:</strong> {venta.fechaVenta}</p>
      <p><strong>Cantidad</strong> {venta.cantidad}</p>
      <p><strong>Monto Total:</strong> {venta.montoTotal}</p>
      <p><strong>ID del Cliente:</strong> {venta.idCliente}</p>
      <p><strong>ID del Usuario:</strong> {venta.idUsuario}</p>
      <p><strong>ID del Producto:</strong> {venta.idProducto}</p>
    </div>
  );
};

export default FacturaVenta;