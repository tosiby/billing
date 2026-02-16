'use client';

import { FormEvent, useEffect, useState } from 'react';
import { api } from '@/lib/api';

interface Staff { id: number; name: string; email: string; role: 'ADMIN' | 'STAFF'; createdAt: string }

export default function StaffPage() {
  const [staff, setStaff] = useState<Staff[]>([]);
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'STAFF' as 'ADMIN' | 'STAFF' });

  const load = () => api<Staff[]>('/staff').then(setStaff).catch(console.error);
  useEffect(() => { load(); }, []);

  async function submit(e: FormEvent) {
    e.preventDefault();
    await api('/staff', { method: 'POST', body: JSON.stringify(form) });
    setForm({ name: '', email: '', password: '', role: 'STAFF' });
    load();
  }

  return (
    <div className="grid lg:grid-cols-2 gap-4">
      <form onSubmit={submit} className="pos-card p-4 space-y-3">
        <h2 className="text-xl font-bold">Add Staff Account</h2>
        <input className="w-full border rounded p-2" placeholder="Name" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
        <input className="w-full border rounded p-2" placeholder="Email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} />
        <input className="w-full border rounded p-2" type="password" placeholder="Password" value={form.password} onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))} />
        <select className="w-full border rounded p-2" value={form.role} onChange={(e) => setForm((f) => ({ ...f, role: e.target.value as 'ADMIN' | 'STAFF' }))}>
          <option value="STAFF">STAFF</option>
          <option value="ADMIN">ADMIN</option>
        </select>
        <button className="w-full py-2 rounded bg-brandOrange text-white font-bold">Create User</button>
      </form>
      <div className="pos-card p-4">
        <h2 className="text-xl font-bold mb-2">All Staff</h2>
        <ul className="space-y-2">
          {staff.map((s) => <li key={s.id} className="border rounded p-2"><p className="font-semibold">{s.name}</p><p className="text-sm">{s.email} • {s.role}</p></li>)}
        </ul>
      </div>
    </div>
  );
}
