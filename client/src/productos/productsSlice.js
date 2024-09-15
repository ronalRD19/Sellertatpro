/// productsSlice.js
import { createSlice } from '@reduxjs/toolkit';

export const productsSlice = createSlice({
  name: 'products',
  initialState: {
    products: [],
    productIds: []
  },
  reducers: {
    
    clearProducts: (state) => {
      state.products = [];
    },

    setProductIds: (state, action) => {
      state.productIds = action.payload;
    },
    addProduct: (state, action) => {
      const existingProduct = state.products.find(product => product.idProducto === action.payload.idProducto);
      if (!existingProduct) {
        state.products.push(action.payload);
      }
    },
    removeProduct: (state, action) => {
      state.products = state.products.filter(product => product.id !== action.payload);
    }
  },
});

export const { setProductIds, addProduct, removeProduct, clearProducts } = productsSlice.actions;

export default productsSlice.reducer;

