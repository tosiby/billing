'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { useAuthStore } from '@/store/auth';
import { User } from '@/lib/types';

export default function LoginPage() {
  const [email, setEmail] = useState('staff@icespot.com');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');
      const data = await api<{ token: string; user: User }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      setAuth(data.token, data.user);
      router.push('/pos');
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-brandOrange/20 to-brandPurple/20 p-4">
      <form onSubmit={onSubmit} className="pos-card w-full max-w-md p-8 space-y-6">
        <h1 className="text-3xl font-bold text-center text-brandPurple">ICE SPOT POS 🍦</h1>
        <p className="text-center text-slate-500">Staff Login</p>
        <input className="w-full rounded-xl border p-3 text-lg" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input className="w-full rounded-xl border p-3 text-lg" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <button disabled={loading} className="w-full rounded-xl bg-brandOrange text-white text-lg py-3 font-semibold disabled:opacity-50">
          {loading ? 'Signing in...' : 'Login'}
        </button>
      </form>
    </main>
  );
}
