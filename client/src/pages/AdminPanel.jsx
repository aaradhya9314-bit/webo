import { Edit3, PackagePlus, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import api from '../api/axios.js';
import Loading from '../components/Loading.jsx';
import { currency, shortDate } from '../utils/format.js';

const emptyProduct = { name: '', description: '', price: '', category: '', stock: '', images: '', brand: '', featured: false, trending: false };

export default function AdminPanel() {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [form, setForm] = useState(emptyProduct);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const load = async () => {
    const [productRes, orderRes] = await Promise.all([api.get('/products?limit=50'), api.get('/orders')]);
    setProducts(productRes.data.products);
    setOrders(orderRes.data);
    setLoading(false);
  };

  useEffect(() => {
    document.title = 'Admin Panel | LuxeCart';
    load();
  }, []);

  const submit = async (event) => {
    event.preventDefault();
    const payload = {
      ...form,
      price: Number(form.price),
      stock: Number(form.stock),
      images: form.images.split(',').map((image) => image.trim()).filter(Boolean)
    };
    try {
      editing ? await api.put(`/products/${editing}`, payload) : await api.post('/products', payload);
      toast.success(editing ? 'Product updated' : 'Product added');
      setForm(emptyProduct);
      setEditing(null);
      load();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Save failed');
    }
  };

  const edit = (product) => {
    setEditing(product._id);
    setForm({ ...product, images: product.images.join(', ') });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const remove = async (id) => {
    if (!confirm('Delete this product?')) return;
    await api.delete(`/products/${id}`);
    toast.success('Product deleted');
    load();
  };

  const updateStatus = async (id, status) => {
    await api.patch(`/orders/${id}/status`, { status });
    toast.success('Order updated');
    load();
  };

  const uploadImage = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const body = new FormData();
    body.append('image', file);
    setUploading(true);
    try {
      const { data } = await api.post('/upload', body, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      const baseUrl = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace('/api', '');
      const imageUrl = `${baseUrl}${data.image}`;
      setForm((current) => ({
        ...current,
        images: current.images ? `${current.images}, ${imageUrl}` : imageUrl
      }));
      toast.success('Image uploaded');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="container-pad py-8 fade-in">
      <div>
        <p className="text-sm font-bold uppercase text-brand-600">Admin</p>
        <h1 className="text-3xl font-extrabold">Admin Panel</h1>
      </div>

      <form onSubmit={submit} className="panel mt-6 p-5">
        <h2 className="flex items-center gap-2 text-xl font-bold"><PackagePlus size={20} /> {editing ? 'Edit Product' : 'Add Product'}</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {['name', 'brand', 'price', 'category', 'stock', 'images'].map((key) => (
            <input key={key} className="field" placeholder={key === 'images' ? 'Image URLs, comma separated' : key} value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} required={['name', 'price', 'category', 'stock', 'images'].includes(key)} />
          ))}
          <textarea className="field min-h-28 md:col-span-2" placeholder="description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
        </div>
        <label className="mt-4 block text-sm font-semibold">
          Upload product image
          <input className="field mt-2" type="file" accept="image/*" onChange={uploadImage} disabled={uploading} />
          {uploading && <span className="mt-1 block text-xs text-slate-500">Uploading image...</span>}
        </label>
        <div className="mt-4 flex flex-wrap gap-4 text-sm font-semibold">
          <label><input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} /> Featured</label>
          <label><input type="checkbox" checked={form.trending} onChange={(e) => setForm({ ...form, trending: e.target.checked })} /> Trending</label>
        </div>
        <div className="mt-5 flex gap-3">
          <button className="btn-primary">{editing ? 'Update product' : 'Add product'}</button>
          {editing && <button type="button" className="btn-secondary" onClick={() => { setEditing(null); setForm(emptyProduct); }}>Cancel</button>}
        </div>
      </form>

      <section className="mt-8 grid gap-6 xl:grid-cols-2">
        <div className="panel p-5">
          <h2 className="text-xl font-bold">Product Management</h2>
          <div className="mt-4 grid gap-3">
            {products.map((product) => (
              <div key={product._id} className="flex items-center gap-3 rounded-md border border-slate-200 p-3 dark:border-slate-800">
                <img src={product.images[0]} alt={product.name} className="h-16 w-16 rounded-md object-cover" />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-bold">{product.name}</p>
                  <p className="text-sm text-slate-500">{currency(product.price)} · {product.stock} stock</p>
                </div>
                <button className="rounded-md p-2 hover:bg-slate-100 dark:hover:bg-slate-800" onClick={() => edit(product)}><Edit3 size={18} /></button>
                <button className="rounded-md p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30" onClick={() => remove(product._id)}><Trash2 size={18} /></button>
              </div>
            ))}
          </div>
        </div>

        <div className="panel p-5">
          <h2 className="text-xl font-bold">Orders</h2>
          <div className="mt-4 grid gap-3">
            {orders.map((order) => (
              <div key={order._id} className="rounded-md border border-slate-200 p-3 dark:border-slate-800">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-bold">#{order._id.slice(-6)} · {order.user?.name}</p>
                    <p className="text-sm text-slate-500">{shortDate(order.createdAt)} · {currency(order.totalPrice)}</p>
                  </div>
                  <select className="field max-w-44" value={order.status} onChange={(event) => updateStatus(order._id, event.target.value)}>
                    {['Processing', 'Packed', 'Shipped', 'Delivered', 'Cancelled'].map((status) => <option key={status}>{status}</option>)}
                  </select>
                </div>
              </div>
            ))}
            {!orders.length && <p className="py-6 text-center text-sm text-slate-500">No orders yet.</p>}
          </div>
        </div>
      </section>
    </div>
  );
}
