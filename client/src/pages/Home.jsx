import { ArrowRight, ShieldCheck, Sparkles, Truck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import api from '../api/axios.js';
import Loading from '../components/Loading.jsx';
import ProductCard from '../components/ProductCard.jsx';

export default function Home() {
  const [data, setData] = useState({ featured: [], trending: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = 'LuxeCart | Premium Everyday Commerce';
    api.get('/products/meta/home')
      .then((res) => setData(res.data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="fade-in">
      <section className="bg-[radial-gradient(circle_at_top_left,#d9efff,transparent_34%),linear-gradient(135deg,#ffffff,#f8fafc_45%,#fff7e6)] dark:bg-[radial-gradient(circle_at_top_left,#123255,transparent_34%),linear-gradient(135deg,#020617,#0f172a_55%,#1f2937)]">
        <div className="container-pad grid min-h-[620px] items-center gap-10 py-12 lg:grid-cols-[1fr_0.9fr]">
          <div className="max-w-2xl">
            <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-brand-100 bg-white/70 px-3 py-1 text-xs font-bold uppercase text-brand-600 dark:border-slate-700 dark:bg-slate-900/70">
              <Sparkles size={15} /> New season essentials
            </p>
            <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-slate-950 sm:text-5xl lg:text-6xl dark:text-white">
              Premium products for smarter everyday shopping.
            </h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-slate-600 sm:text-lg dark:text-slate-300">
              Discover curated tech, fashion, home, beauty, and kitchen favorites with quick checkout and a polished shopping flow.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/products" className="btn-primary">
                Shop products <ArrowRight size={18} />
              </Link>
              <Link to="/about" className="btn-secondary">
                Our story
              </Link>
            </div>
            <div className="mt-10 grid max-w-xl gap-4 sm:grid-cols-3">
              {[
                ['Fast delivery', Truck],
                ['Secure checkout', ShieldCheck],
                ['Curated quality', Sparkles]
              ].map(([label, Icon]) => (
                <div key={label} className="flex items-center gap-2 text-sm font-semibold text-slate-600 dark:text-slate-300">
                  <Icon size={18} className="text-brand-600" />
                  {label}
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1607082349566-187342175e2f?auto=format&fit=crop&w=1100&q=85"
              alt="Premium shopping products"
              className="aspect-[4/3] w-full rounded-lg object-cover shadow-soft"
            />
            <div className="absolute -bottom-6 left-6 right-6 rounded-lg bg-white p-4 shadow-soft dark:bg-slate-900">
              <p className="text-sm font-semibold">Today only</p>
              <p className="mt-1 text-2xl font-extrabold">Free shipping over $150</p>
            </div>
          </div>
        </div>
      </section>

      {loading ? (
        <Loading />
      ) : (
        <>
          <ProductSection title="Featured Products" products={data.featured} />
          <ProductSection title="Trending Products" products={data.trending} />
        </>
      )}
    </div>
  );
}

function ProductSection({ title, products }) {
  return (
    <section className="container-pad py-12">
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <p className="text-sm font-bold uppercase text-brand-600">Curated picks</p>
          <h2 className="mt-1 text-2xl font-extrabold">{title}</h2>
        </div>
        <Link to="/products" className="text-sm font-semibold text-brand-600">
          View all
        </Link>
      </div>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {products.map((product) => <ProductCard key={product._id} product={product} />)}
      </div>
    </section>
  );
}

