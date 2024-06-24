import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  usuario: null,
};

const userSlice = createSlice({
  name: 'login_registro',
  initialState,
  reducers: {
    setUser: (state, action) => {
      console.log("Esto es lo que se recibe en UserSlice.js:", action.payload);
      state.usuario = action.payload;
    },
    logoutUser: (state) => {
      console.log("Logging out user, resetting state...");
      state.usuario = null;
    },
  },
});

export const { setUser, logoutUser } = userSlice.actions;
export default userSlice.reducer;