import { createSlice } from '@reduxjs/toolkit';


const storedUser = localStorage.getItem('currentUser');
const initialUser = storedUser ? JSON.parse(storedUser) : null;

const userSlice = createSlice({
  name: 'user',
  initialState: {
    currentUser: initialUser,
  },
  reducers: {
    login(state, action) {
      state.currentUser = action.payload;
      // שמירה ב-localStorage
      localStorage.setItem('currentUser', JSON.stringify(action.payload));
      // שמור גם name ו-image בנפרד לנגישות קלה
      if (action.payload && action.payload.name) {
        localStorage.setItem('userName', action.payload.name);
      }
      if (action.payload && action.payload.image) {
        localStorage.setItem('userImage', action.payload.image);
      }
      if (action.payload && action.payload.token) {
        localStorage.setItem('userToken', action.payload.token);
      }
    },
    logout(state) {
      state.currentUser = null;
      // מחיקה מה-localStorage
      localStorage.removeItem('currentUser');
      localStorage.removeItem('userName');
      localStorage.removeItem('userImage');
      localStorage.removeItem('userToken');
    },
  },
});

export const { login, logout } = userSlice.actions;
export default userSlice.reducer;
