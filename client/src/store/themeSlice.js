import { createSlice } from '@reduxjs/toolkit';

const initialMode = localStorage.getItem('luxecart_theme') || 'light';
document.documentElement.classList.toggle('dark', initialMode === 'dark');

const themeSlice = createSlice({
  name: 'theme',
  initialState: { mode: initialMode },
  reducers: {
    toggleTheme(state) {
      state.mode = state.mode === 'dark' ? 'light' : 'dark';
      localStorage.setItem('luxecart_theme', state.mode);
      document.documentElement.classList.toggle('dark', state.mode === 'dark');
    }
  }
});

export const { toggleTheme } = themeSlice.actions;
export default themeSlice.reducer;

