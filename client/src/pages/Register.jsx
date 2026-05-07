import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { register } from '../store/authSlice.js';
import { AuthShell, Field } from './Login.jsx';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.auth);

  const submit = async (event) => {
    event.preventDefault();
    const nextErrors = {};
    if (form.name.trim().length < 2) nextErrors.name = 'Name is required';
    if (!/\S+@\S+\.\S+/.test(form.email)) nextErrors.email = 'Enter a valid email address';
    if (form.password.length < 6) nextErrors.password = 'Use at least 6 characters';
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    const result = await dispatch(register(form));
    if (result.meta.requestStatus === 'fulfilled') navigate('/dashboard');
  };

  return <AuthShell title="Create account" subtitle="Start your LuxeCart shopping journey">
    <form onSubmit={submit} className="space-y-4">
      <Field label="Full name" error={errors.name}><input className="field" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></Field>
      <Field label="Email" error={errors.email}><input className="field" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></Field>
      <Field label="Password" error={errors.password}><input className="field" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} /></Field>
      <button className="btn-primary w-full" disabled={loading}>{loading ? 'Creating...' : 'Register'}</button>
      <p className="text-center text-sm text-slate-500">Already have an account? <Link className="font-semibold text-brand-600" to="/login">Login</Link></p>
    </form>
  </AuthShell>;
}

