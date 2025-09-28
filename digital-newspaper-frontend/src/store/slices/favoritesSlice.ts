// src/redux/favoritesSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Article {
  id: number;
  title: string;
  text: string;
  imge?: string;
  reporterName: string;
  propilReporter: string;
  publishedAt: string;
}

interface FavoritesState {
  items: Article[];
}

const initialState: FavoritesState = {
  items: [],
};

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    addFavorite: (state, action: PayloadAction<Article>) => {
      const exists = state.items.find(a => a.id === action.payload.id);
      if (!exists) {
        state.items.push(action.payload);
      }
    },
    removeFavorite: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter(a => a.id !== action.payload);
    },
    clearFavorites: (state) => {
      state.items = [];
    },
  },
});

export const { addFavorite, removeFavorite, clearFavorites } = favoritesSlice.actions;
export default favoritesSlice.reducer;