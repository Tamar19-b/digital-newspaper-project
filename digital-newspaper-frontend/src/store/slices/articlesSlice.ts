import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Article } from '../../Components/ReporterHome/index';

interface ArticlesState {
  items: Article[];
  loading: boolean;
  error: string | null;
  lastUpdatedToggle: boolean;
}

const initialState: ArticlesState = {
  items: [],
  loading: false,
  error: null,
  lastUpdatedToggle: false,
};

const articlesSlice = createSlice({
  name: 'articles',
  initialState,
  reducers: {
    setArticles: (state, action: PayloadAction<Article[]>) => {
      state.items = action.payload;
      state.loading = false;
    },
    addArticle: (state, action: PayloadAction<Article>) => {
      state.items.unshift(action.payload);
    },
    updateArticle: (state, action: PayloadAction<Article>) => {
      const index = state.items.findIndex(a => a.idArticle === action.payload.idArticle);
      if (index !== -1) state.items[index] = action.payload;
    },
    deleteArticle: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter(a => a.idArticle !== action.payload);
    },
    startLoading: (state) => { state.loading = true; },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },
    triggerSync: (state) => {
      state.lastUpdatedToggle = !state.lastUpdatedToggle;
    },
  },
});

export const {
  setArticles,
  addArticle,
  updateArticle,
  deleteArticle,
  startLoading,
  setError,
  triggerSync,
} = articlesSlice.actions;

export default articlesSlice.reducer;
