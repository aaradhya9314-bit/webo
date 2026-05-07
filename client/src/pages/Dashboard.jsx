import { Package, ShieldCheck, UserRound } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import api from '../api/axios.js';
import Loading from '../components/Loading.jsx';
import { currency, shortDate } from '../utils/format.js';

export default function Dashboard() {
  const { user } = useSelector((state) => state.auth);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = 'Dashboard | LuxeCart';
    api.get('/orders/my').then((res) => setOrders(res.data)).finally(() => setLoading(false));
  }, []);

  return (
    <div className="container-pad py-8 fade-in">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm font-bold uppercase text-brand-600">Account</p>
          <h1 className="text-3xl font-extrabold">Hi, {user.name}</h1>
        </div>
        {user.role === 'admin' && <Link to="/admin" className="btn-primary"><ShieldCheck size={18} /> Admin Panel</Link>}
      </div>
      <div className="mt-6 grid gap-5 lg:grid-cols-[320px_1fr]">
        <aside className="panel h-fit p-5">
          <UserRound className="text-brand-600" />
          <h2 className="mt-3 font-bold">{user.name}</h2>
          <p className="text-sm text-slate-500">{user.email}</p>
          <p className="mt-4 rounded-md bg-slate-100 px-3 py-2 text-sm font-semibold dark:bg-slate-800">{user.role}</p>
        </aside>
        <section className="panel p-5">
          <h2 className="flex items-center gap-2 text-xl font-bold"><Package size={20} /> Order Management</h2>
          {loading ? <Loading /> : (
            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[640px] text-left text-sm">
                <thead className="text-slate-500">
                  <tr><th className="py-3">Order</th><th>Date</th><th>Total</th><th>Status</th></tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order._id} className="border-t border-slate-200 dark:border-slate-800">
                      <td className="py-3 font-semibold">#{order._id.slice(-6)}</td>
                      <td>{shortDate(order.createdAt)}</td>
                      <td>{currency(order.totalPrice)}</td>
                      <td><span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-bold text-brand-700 dark:bg-brand-900/40 dark:text-brand-100">{order.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {!orders.length && <p className="py-8 text-center text-sm text-slate-500">No orders yet.</p>}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

