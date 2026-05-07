import { Minus, Plus, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { removeFromCart, selectCartTotals, updateQuantity } from '../store/cartSlice.js';
import { currency } from '../utils/format.js';

export default function Cart() {
  const dispatch = useDispatch();
  const items = useSelector((state) => state.cart.items);
  const totals = useSelector(selectCartTotals);

  return (
    <div className="container-pad py-8 fade-in">
      <h1 className="text-3xl font-extrabold">Shopping Cart</h1>
      {items.length === 0 ? (
        <div className="panel mt-6 p-8 text-center">
          <p className="text-slate-500">Your cart is empty.</p>
          <Link to="/products" className="btn-primary mt-4">Continue shopping</Link>
        </div>
      ) : (
        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_360px]">
          <div className="grid gap-4">
            {items.map((item) => (
              <div key={item._id} className="panel grid gap-4 p-4 sm:grid-cols-[110px_1fr_auto] sm:items-center">
                <img src={item.images?.[0]} alt={item.name} className="h-28 w-full rounded-md object-cover sm:w-28" />
                <div>
                  <Link to={`/products/${item._id}`} className="font-bold hover:text-brand-600">{item.name}</Link>
                  <p className="mt-1 text-sm text-slate-500">{currency(item.price)}</p>
                  <div className="mt-3 inline-flex items-center rounded-md border border-slate-200 dark:border-slate-800">
                    <button className="p-2" onClick={() => dispatch(updateQuantity({ id: item._id, quantity: item.quantity - 1 }))}><Minus size={15} /></button>
                    <span className="w-9 text-center text-sm font-bold">{item.quantity}</span>
                    <button className="p-2" onClick={() => dispatch(updateQuantity({ id: item._id, quantity: item.quantity + 1 }))}><Plus size={15} /></button>
                  </div>
                </div>
                <div className="flex items-center justify-between gap-4 sm:block sm:text-right">
                  <p className="font-extrabold">{currency(item.price * item.quantity)}</p>
                  <button className="mt-3 rounded-md p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30" onClick={() => dispatch(removeFromCart(item._id))}>
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
          <OrderSummary totals={totals} />
        </div>
      )}
    </div>
  );
}

export function OrderSummary({ totals, checkout = true }) {
  return (
    <aside className="panel h-fit p-5">
      <h2 className="text-xl font-bold">Order Summary</h2>
      <div className="mt-5 grid gap-3 text-sm">
        <Row label="Subtotal" value={currency(totals.itemsPrice)} />
        <Row label="Shipping" value={currency(totals.shippingPrice)} />
        <Row label="Tax" value={currency(totals.taxPrice)} />
        <div className="border-t border-slate-200 pt-3 dark:border-slate-800">
          <Row label="Total" value={currency(totals.totalPrice)} strong />
        </div>
      </div>
      {checkout && <Link to="/checkout" className="btn-primary mt-5 w-full">Checkout</Link>}
    </aside>
  );
}

function Row({ label, value, strong }) {
  return <div className={`flex justify-between ${strong ? 'text-lg font-extrabold' : 'text-slate-600 dark:text-slate-300'}`}><span>{label}</span><span>{value}</span></div>;
}

