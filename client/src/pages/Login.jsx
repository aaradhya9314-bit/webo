import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../store/authSlice.js';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '', remember: true });
  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { loading } = useSelector((state) => state.auth);

  const submit = async (event) => {
    event.preventDefault();
    const nextErrors = {};
    if (!/\S+@\S+\.\S+/.test(form.email)) nextErrors.email = 'Enter a valid email address';
    if (form.password.length < 6) nextErrors.password = 'Password must be at least 6 characters';
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    const result = await dispatch(login(form));
    if (result.meta.requestStatus === 'fulfilled') navigate(location.state?.from || '/dashboard');
  };

  return <AuthShell title="Welcome back" subtitle="Login to continue shopping">
    <form onSubmit={submit} className="space-y-4">
      <Field label="Email" error={errors.email}><input className="field" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></Field>
      <Field label="Password" error={errors.password}><input className="field" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} /></Field>
      <label className="flex items-center gap-2 text-sm text-slate-500"><input type="checkbox" checked={form.remember} onChange={(e) => setForm({ ...form, remember: e.target.checked })} /> Remember login session</label>
      <button className="btn-primary w-full" disabled={loading}>{loading ? 'Signing in...' : 'Login'}</button>
      <p className="text-center text-sm text-slate-500">New here? <Link className="font-semibold text-brand-600" to="/register">Create account</Link></p>
    </form>
  </AuthShell>;
}

export function AuthShell({ title, subtitle, children }) {
  return (
    <div className="container-pad grid min-h-[calc(100vh-8rem)] place-items-center py-10">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-lg border border-slate-200 bg-white shadow-soft md:grid-cols-2 dark:border-slate-800 dark:bg-slate-900">
        <div className="hidden bg-[linear-gradient(135deg,rgba(19,118,248,.92),rgba(233,155,20,.72)),url('https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=900&q=80')] bg-cover p-10 text-white md:block">
          <h2 className="text-3xl font-extrabold">Shop beautifully, manage easily.</h2>
          <p className="mt-4 text-white/85">A premium MERN storefront with secure auth and a clean checkout path.</p>
        </div>
        <div className="p-6 sm:p-10">
          <h1 className="text-3xl font-extrabold">{title}</h1>
          <p className="mt-2 text-sm text-slate-500">{subtitle}</p>
          <div className="mt-8">{children}</div>
        </div>
      </div>
    </div>
  );
}

export function Field({ label, error, children }) {
  return <label className="block text-sm font-semibold">{label}<div className="mt-1">{children}</div>{error && <span className="mt-1 block text-xs text-rose-500">{error}</span>}</label>;
}

