import { Facebook, Instagram, Linkedin, Twitter } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
      <div className="container-pad grid gap-8 py-10 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <h2 className="text-xl font-extrabold">Luxe<span className="text-brand-600">Cart</span></h2>
          <p className="mt-3 max-w-md text-sm leading-6 text-slate-500">
            Premium everyday essentials with fast checkout, thoughtful curation, and a clean shopping experience.
          </p>
          <div className="mt-5 flex gap-3 text-slate-500">
            <Twitter size={19} />
            <Instagram size={19} />
            <Facebook size={19} />
            <Linkedin size={19} />
          </div>
        </div>
        <div>
          <h3 className="font-semibold">Shop</h3>
          <div className="mt-3 grid gap-2 text-sm text-slate-500">
            <Link to="/products">Products</Link>
            <Link to="/cart">Cart</Link>
            <Link to="/dashboard">Orders</Link>
          </div>
        </div>
        <div>
          <h3 className="font-semibold">Company</h3>
          <div className="mt-3 grid gap-2 text-sm text-slate-500">
            <Link to="/about">About</Link>
            <Link to="/contact">Contact</Link>
            <span>support@luxecart.dev</span>
          </div>
        </div>
      </div>
      <div className="border-t border-slate-200 py-4 text-center text-xs text-slate-500 dark:border-slate-800">
        © 2026 LuxeCart. All rights reserved.
      </div>
    </footer>
  );
}

