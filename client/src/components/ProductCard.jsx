import { Heart, ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../store/cartSlice.js';
import { toggleWishlist } from '../store/authSlice.js';
import { currency } from '../utils/format.js';
import Rating from './Rating.jsx';

export default function ProductCard({ product }) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const liked = user?.wishlist?.some((id) => id === product._id);

  return (
    <article className="group overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-soft dark:border-slate-800 dark:bg-slate-900">
      <Link to={`/products/${product._id}`} className="block bg-slate-100 dark:bg-slate-800">
        <img src={product.images?.[0]} alt={product.name} className="aspect-[4/3] w-full object-cover transition duration-500 group-hover:scale-105" />
      </Link>
      <div className="space-y-3 p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-brand-600">{product.category}</p>
            <Link to={`/products/${product._id}`} className="mt-1 line-clamp-2 font-semibold hover:text-brand-600">
              {product.name}
            </Link>
          </div>
          <button
            type="button"
            aria-label="Toggle wishlist"
            className="rounded-md p-2 text-slate-500 transition hover:bg-slate-100 hover:text-rose-500 dark:hover:bg-slate-800"
            onClick={() => user && dispatch(toggleWishlist(product._id))}
          >
            <Heart size={18} className={liked ? 'fill-rose-500 text-rose-500' : ''} />
          </button>
        </div>
        <Rating value={product.rating} count={product.numReviews} />
        <div className="flex items-center justify-between gap-3">
          <span className="text-lg font-bold">{currency(product.price)}</span>
          <button type="button" className="btn-primary px-3" onClick={() => dispatch(addToCart(product))}>
            <ShoppingCart size={17} />
            Add
          </button>
        </div>
      </div>
    </article>
  );
}

