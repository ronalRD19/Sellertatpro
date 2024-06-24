import React from 'react';

// Crear el contexto con un valor predeterminado (opcional)
const ProductoContext = React.createContext({
  informacionProducto: () => console.warn("informacionProducto no está definido"),
  //productos: []
});

export default ProductoContext;