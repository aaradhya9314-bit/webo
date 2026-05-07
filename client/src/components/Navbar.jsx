import { Heart, Menu, Moon, Search, ShoppingBag, Sun, User, X } from 'lucide-react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/authSlice.js';
import { selectCartTotals } from '../store/cartSlice.js';
import { toggleTheme } from '../store/themeSlice.js';

const links = [
  ['Home', '/'],
  ['Products', '/products'],
  ['About', '/about'],
  ['Contact', '/contact']
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { mode } = useSelector((state) => state.theme);
  const totals = useSelector(selectCartTotals);

  const search = (event) => {
    event.preventDefault();
    navigate(`/products${query ? `?search=${encodeURIComponent(query)}` : ''}`);
    setOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur dark:border-slate-800 dark:bg-slate-950/90">
      <div className="container-pad flex h-16 items-center justify-between gap-4">
        <Link to="/" className="text-xl font-extrabold tracking-tight">
          Luxe<span className="text-brand-600">Cart</span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {links.map(([label, href]) => (
            <NavLink key={href} to={href} className={({ isActive }) => `text-sm font-semibold ${isActive ? 'text-brand-600' : 'text-slate-600 dark:text-slate-300'}`}>
              {label}
            </NavLink>
          ))}
        </nav>

        <form onSubmit={search} className="hidden min-w-64 max-w-sm flex-1 items-center rounded-md border border-slate-200 bg-slate-50 px-3 md:flex dark:border-slate-800 dark:bg-slate-900">
          <Search size={17} className="text-slate-400" />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search products" className="w-full bg-transparent px-2 py-2 text-sm outline-none" />
        </form>

        <div className="flex items-center gap-1">
          <button type="button" aria-label="Toggle theme" className="rounded-md p-2 hover:bg-slate-100 dark:hover:bg-slate-800" onClick={() => dispatch(toggleTheme())}>
            {mode === 'dark' ? <Sun size={19} /> : <Moon size={19} />}
          </button>
          <Link to="/cart" aria-label="Cart" className="relative rounded-md p-2 hover:bg-slate-100 dark:hover:bg-slate-800">
            <ShoppingBag size={20} />
            {totals.count > 0 && <span className="absolute -right-1 -top-1 rounded-full bg-accent-500 px-1.5 text-xs font-bold text-white">{totals.count}</span>}
          </Link>
          <Link to="/dashboard" aria-label="Account" className="hidden rounded-md p-2 hover:bg-slate-100 sm:block dark:hover:bg-slate-800">
            <User size={20} />
          </Link>
          {user ? (
            <button type="button" className="hidden text-sm font-semibold text-slate-600 sm:block dark:text-slate-300" onClick={() => dispatch(logout())}>
              Logout
            </button>
          ) : (
            <Link to="/login" className="hidden text-sm font-semibold text-brand-600 sm:block">
              Login
            </Link>
          )}
          <button type="button" aria-label="Open menu" className="rounded-md p-2 md:hidden" onClick={() => setOpen((value) => !value)}>
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-slate-200 bg-white p-4 md:hidden dark:border-slate-800 dark:bg-slate-950">
          <form onSubmit={search} className="mb-4 flex items-center rounded-md border border-slate-200 px-3 dark:border-slate-800">
            <Search size={17} />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search products" className="w-full bg-transparent px-2 py-2 text-sm outline-none" />
          </form>
          <div className="grid gap-3">
            {links.map(([label, href]) => (
              <Link key={href} to={href} onClick={() => setOpen(false)} className="font-semibold">
                {label}
              </Link>
            ))}
            <Link to="/dashboard" onClick={() => setOpen(false)} className="font-semibold">
              Dashboard
            </Link>
            {user?.role === 'admin' && (
              <Link to="/admin" onClick={() => setOpen(false)} className="font-semibold">
                Admin Panel
              </Link>
            )}
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <Heart size={16} />
              {user?.wishlist?.length || 0} wishlist items
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

