import { createSlice } from '@reduxjs/toolkit';
import toast from 'react-hot-toast';

const loadCart = () => JSON.parse(localStorage.getItem('luxecart_cart') || '{"items":[]}');
const saveCart = (state) => localStorage.setItem('luxecart_cart', JSON.stringify({ items: state.items }));

const cartSlice = createSlice({
  name: 'cart',
  initialState: loadCart(),
  reducers: {
    addToCart(state, action) {
      const product = action.payload;
      const existing = state.items.find((item) => item._id === product._id);
      if (existing) {
        existing.quantity += 1;
      } else {
        state.items.push({ ...product, quantity: 1 });
      }
      saveCart(state);
      toast.success('Added to cart');
    },
    removeFromCart(state, action) {
      state.items = state.items.filter((item) => item._id !== action.payload);
      saveCart(state);
      toast.success('Removed from cart');
    },
    updateQuantity(state, action) {
      const item = state.items.find((entry) => entry._id === action.payload.id);
      if (item) item.quantity = Math.max(1, action.payload.quantity);
      saveCart(state);
    },
    clearCart(state) {
      state.items = [];
      saveCart(state);
    }
  }
});

export const selectCartTotals = (state) => {
  const itemsPrice = state.cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingPrice = itemsPrice > 150 || itemsPrice === 0 ? 0 : 12;
  const taxPrice = itemsPrice * 0.08;
  return {
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice: itemsPrice + shippingPrice + taxPrice,
    count: state.cart.items.reduce((sum, item) => sum + item.quantity, 0)
  };
};

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;

