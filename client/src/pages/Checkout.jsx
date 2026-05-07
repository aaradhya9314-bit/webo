import { CreditCard, MapPin } from 'lucide-react';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../api/axios.js';
import { clearCart, selectCartTotals } from '../store/cartSlice.js';
import { OrderSummary } from './Cart.jsx';

export default function Checkout() {
  const [address, setAddress] = useState({ fullName: '', street: '', city: '', state: '', postalCode: '', country: '', phone: '' });
  const [paymentMethod, setPaymentMethod] = useState('Card');
  const [loading, setLoading] = useState(false);
  const items = useSelector((state) => state.cart.items);
  const totals = useSelector(selectCartTotals);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const placeOrder = async (event) => {
    event.preventDefault();
    if (!items.length) return toast.error('Your cart is empty');
    if (Object.values(address).some((value) => !value.trim())) return toast.error('Complete the delivery address');
    setLoading(true);
    try {
      await api.post('/orders', {
        items: items.map((item) => ({ product: item._id, name: item.name, image: item.images[0], price: item.price, quantity: item.quantity })),
        shippingAddress: address,
        paymentMethod,
        ...totals
      });
      dispatch(clearCart());
      toast.success('Order placed');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Checkout failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-pad py-8 fade-in">
      <h1 className="text-3xl font-extrabold">Checkout</h1>
      <form onSubmit={placeOrder} className="mt-6 grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="grid gap-6">
          <section className="panel p-5">
            <h2 className="flex items-center gap-2 text-xl font-bold"><MapPin size={20} /> Delivery Address</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {Object.keys(address).map((key) => (
                <input key={key} className="field" placeholder={key.replace(/([A-Z])/g, ' $1')} value={address[key]} onChange={(event) => setAddress({ ...address, [key]: event.target.value })} />
              ))}
            </div>
          </section>
          <section className="panel p-5">
            <h2 className="flex items-center gap-2 text-xl font-bold"><CreditCard size={20} /> Payment Method</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {['Card', 'UPI', 'Cash on Delivery'].map((method) => (
                <label key={method} className={`cursor-pointer rounded-md border p-4 text-sm font-semibold ${paymentMethod === method ? 'border-brand-500 bg-brand-50 text-brand-700 dark:bg-brand-900/30 dark:text-brand-100' : 'border-slate-200 dark:border-slate-800'}`}>
                  <input className="sr-only" type="radio" checked={paymentMethod === method} onChange={() => setPaymentMethod(method)} />
                  {method}
                </label>
              ))}
            </div>
          </section>
        </div>
        <div>
          <OrderSummary totals={totals} checkout={false} />
          <button className="btn-primary mt-4 w-full" disabled={loading}>{loading ? 'Placing order...' : 'Place dummy payment order'}</button>
        </div>
      </form>
    </div>
  );
}

