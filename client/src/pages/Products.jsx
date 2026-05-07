import { SlidersHorizontal } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../api/axios.js';
import Loading from '../components/Loading.jsx';
import ProductCard from '../components/ProductCard.jsx';

export default function Products() {
  const [params, setParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [meta, setMeta] = useState({ categories: [], page: 1, pages: 1, total: 0 });
  const [loading, setLoading] = useState(true);

  const filters = useMemo(() => ({
    search: params.get('search') || '',
    category: params.get('category') || 'All',
    sort: params.get('sort') || 'newest',
    page: Number(params.get('page') || 1)
  }), [params]);

  useEffect(() => {
    document.title = 'Products | LuxeCart';
    setLoading(true);
    Promise.all([
      api.get('/products', { params: filters }),
      api.get('/products/meta/home')
    ]).then(([productRes, metaRes]) => {
      setProducts(productRes.data.products);
      setMeta({ ...productRes.data, categories: metaRes.data.categories });
    }).finally(() => setLoading(false));
  }, [filters]);

  const update = (key, value) => {
    const next = new URLSearchParams(params);
    value ? next.set(key, value) : next.delete(key);
    if (key !== 'page') next.set('page', '1');
    setParams(next);
  };

  return (
    <div className="container-pad py-8 fade-in">
      <div className="mb-7 flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div>
          <p className="text-sm font-bold uppercase text-brand-600">Shop collection</p>
          <h1 className="mt-1 text-3xl font-extrabold">Products</h1>
          <p className="mt-2 text-sm text-slate-500">{meta.total} products found</p>
        </div>
        <div className="grid gap-3 sm:grid-cols-3 lg:min-w-[720px]">
          <input className="field" value={filters.search} onChange={(event) => update('search', event.target.value)} placeholder="Search products" />
          <select className="field" value={filters.category} onChange={(event) => update('category', event.target.value)}>
            <option>All</option>
            {meta.categories.map((category) => <option key={category}>{category}</option>)}
          </select>
          <select className="field" value={filters.sort} onChange={(event) => update('sort', event.target.value)}>
            <option value="newest">Newest</option>
            <option value="rating">Top rated</option>
            <option value="price_asc">Price: low to high</option>
            <option value="price_desc">Price: high to low</option>
          </select>
        </div>
      </div>

      <div className="mb-5 flex items-center gap-2 text-sm font-semibold text-slate-500">
        <SlidersHorizontal size={17} /> Search, filter, and sort the catalog
      </div>

      {loading ? <Loading /> : (
        <>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((product) => <ProductCard key={product._id} product={product} />)}
          </div>
          <div className="mt-8 flex justify-center gap-2">
            {Array.from({ length: meta.pages }).map((_, index) => (
              <button
                key={index}
                type="button"
                className={`h-10 w-10 rounded-md text-sm font-bold ${filters.page === index + 1 ? 'bg-brand-600 text-white' : 'border border-slate-200 dark:border-slate-800'}`}
                onClick={() => update('page', String(index + 1))}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

