// src/app/store.js
import { configureStore } from '@reduxjs/toolkit';
import productsReducer from './productos/productsSlice';
import userReducer from './login_registro/UserSlice';

export const store = configureStore({
  reducer: {
    login_registro: userReducer,
    products: productsReducer,
  },
});