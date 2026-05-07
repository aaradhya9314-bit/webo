import { Heart, Minus, Plus, ShoppingCart } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../api/axios.js';
import Loading from '../components/Loading.jsx';
import Rating from '../components/Rating.jsx';
import { addToCart } from '../store/cartSlice.js';
import { toggleWishlist } from '../store/authSlice.js';
import { currency } from '../utils/format.js';

export default function ProductDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [review, setReview] = useState({ rating: 5, comment: '' });
  const [qty, setQty] = useState(1);

  useEffect(() => {
    setLoading(true);
    api.get(`/products/${id}`).then((res) => {
      setProduct(res.data);
      document.title = `${res.data.name} | LuxeCart`;
    }).finally(() => setLoading(false));
  }, [id]);

  const submitReview = async (event) => {
    event.preventDefault();
    try {
      await api.post(`/products/${id}/reviews`, review);
      toast.success('Review submitted');
      const { data } = await api.get(`/products/${id}`);
      setProduct(data);
      setReview({ rating: 5, comment: '' });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Review failed');
    }
  };

  if (loading) return <Loading />;
  if (!product) return null;

  return (
    <div className="container-pad py-8 fade-in">
      <div className="grid gap-8 lg:grid-cols-2">
        <div className="overflow-hidden rounded-lg bg-slate-100 dark:bg-slate-800">
          <img src={product.images?.[0]} alt={product.name} className="aspect-square w-full object-cover" />
        </div>
        <div>
          <p className="text-sm font-bold uppercase text-brand-600">{product.category}</p>
          <h1 className="mt-2 text-3xl font-extrabold">{product.name}</h1>
          <div className="mt-3"><Rating value={product.rating} count={product.numReviews} /></div>
          <p className="mt-5 text-3xl font-extrabold">{currency(product.price)}</p>
          <p className="mt-5 leading-7 text-slate-600 dark:text-slate-300">{product.description}</p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <div className="flex items-center rounded-md border border-slate-200 dark:border-slate-800">
              <button className="p-3" onClick={() => setQty(Math.max(1, qty - 1))}><Minus size={16} /></button>
              <span className="w-10 text-center font-bold">{qty}</span>
              <button className="p-3" onClick={() => setQty(Math.min(product.stock, qty + 1))}><Plus size={16} /></button>
            </div>
            <button className="btn-primary" onClick={() => Array.from({ length: qty }).forEach(() => dispatch(addToCart(product)))}>
              <ShoppingCart size={18} /> Add to cart
            </button>
            <button className="btn-secondary" onClick={() => user ? dispatch(toggleWishlist(product._id)) : toast.error('Login to use wishlist')}>
              <Heart size={18} /> Wishlist
            </button>
          </div>
          <div className="mt-5 text-sm font-semibold text-slate-500">{product.stock} items in stock</div>
        </div>
      </div>

      <section className="mt-12 grid gap-6 lg:grid-cols-[0.8fr_1fr]">
        <form onSubmit={submitReview} className="panel p-5">
          <h2 className="text-xl font-bold">Write a review</h2>
          <select className="field mt-4" value={review.rating} onChange={(event) => setReview({ ...review, rating: event.target.value })}>
            {[5, 4, 3, 2, 1].map((rating) => <option key={rating} value={rating}>{rating} stars</option>)}
          </select>
          <textarea className="field mt-3 min-h-32" value={review.comment} onChange={(event) => setReview({ ...review, comment: event.target.value })} placeholder="Share your experience" />
          <button className="btn-primary mt-3" disabled={!user}>Submit review</button>
        </form>
        <div className="panel p-5">
          <h2 className="text-xl font-bold">Customer reviews</h2>
          <div className="mt-4 grid gap-4">
            {product.reviews?.length ? product.reviews.map((item) => (
              <div key={item._id} className="border-b border-slate-200 pb-4 last:border-0 dark:border-slate-800">
                <div className="flex items-center justify-between gap-3">
                  <strong>{item.name}</strong>
                  <Rating value={item.rating} />
                </div>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{item.comment}</p>
              </div>
            )) : <p className="text-sm text-slate-500">No reviews yet.</p>}
          </div>
        </div>
      </section>
    </div>
  );
}

