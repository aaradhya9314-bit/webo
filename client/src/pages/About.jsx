import { Award, Leaf, Users } from 'lucide-react';

export default function About() {
  return (
    <div className="fade-in">
      <section className="container-pad grid gap-10 py-12 lg:grid-cols-2 lg:items-center">
        <div>
          <p className="text-sm font-bold uppercase text-brand-600">About LuxeCart</p>
          <h1 className="mt-2 text-4xl font-extrabold">Commerce that feels polished from browse to delivery.</h1>
          <p className="mt-5 leading-7 text-slate-600 dark:text-slate-300">
            LuxeCart is a modern MERN e-commerce experience built for clean discovery, fast checkout, and simple account management.
          </p>
        </div>
        <img src="https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?auto=format&fit=crop&w=1000&q=85" alt="Retail workspace" className="rounded-lg shadow-soft" />
      </section>
      <section className="container-pad grid gap-5 pb-12 md:grid-cols-3">
        {[[Award, 'Premium quality'], [Leaf, 'Thoughtful selection'], [Users, 'Beginner friendly']].map(([Icon, title]) => (
          <div key={title} className="panel p-5">
            <Icon className="text-brand-600" />
            <h2 className="mt-4 text-lg font-bold">{title}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">Clear flows, responsive layouts, and practical details for everyday users.</p>
          </div>
        ))}
      </section>
    </div>
  );
}

