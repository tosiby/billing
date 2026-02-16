'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { Category, Item, Sale } from '@/lib/types';
import { useCartStore } from '@/store/cart';

const tabs: Category[] = ['CONE', 'CUP', 'SUNDAE'];

export default function PosPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [activeTab, setActiveTab] = useState<Category>('CONE');
  const [paymentMode, setPaymentMode] = useState<'CASH' | 'UPI'>('CASH');
  const [showCheckout, setShowCheckout] = useState(false);
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  const { lines, addItem, increase, decrease, remove, clear, total } = useCartStore();

  useEffect(() => {
    api<Item[]>('/items').then(setItems).catch(console.error);
  }, []);

  const filtered = useMemo(() => items.filter((i) => i.category === activeTab && i.isActive), [items, activeTab]);

  async function checkout() {
    try {
      setSaving(true);
      const sale = await api<Sale>('/sales', {
        method: 'POST',
        body: JSON.stringify({
          paymentMode,
          items: lines.map((l) => ({ itemId: l.item.id, quantity: l.quantity })),
        }),
      });
      clear();
      router.push(`/receipt/${sale.id}`);
    } finally {
      setSaving(false);
      setShowCheckout(false);
    }
  }

  return (
    <div className="grid lg:grid-cols-[1fr_360px] gap-4">
      <section className="space-y-4">
        <div className="flex gap-2">
          {tabs.map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`px-6 py-3 text-lg font-bold rounded-xl ${activeTab === tab ? 'bg-brandOrange text-white' : 'bg-white'}`}>
              {tab}
            </button>
          ))}
        </div>
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-3">
          {filtered.map((item) => (
            <button key={item.id} onClick={() => addItem(item)} className="pos-card p-5 text-left min-h-28 hover:border-brandPurple">
              <h3 className="text-xl font-bold">{item.name}</h3>
              <p className="text-brandPurple text-lg font-semibold">₹{item.price}</p>
              <p className={`text-sm ${item.stock <= item.lowStockLevel ? 'text-red-600' : 'text-slate-500'}`}>Stock: {item.stock}</p>
            </button>
          ))}
        </div>
      </section>

      <aside className="pos-card p-4 h-fit sticky top-20">
        <h2 className="font-bold text-xl mb-3">Cart</h2>
        <div className="space-y-2 max-h-96 overflow-auto">
          {lines.map((line) => (
            <div key={line.item.id} className="border rounded-xl p-2">
              <p className="font-semibold">{line.item.name}</p>
              <div className="flex justify-between items-center mt-1">
                <div className="flex items-center gap-2">
                  <button onClick={() => decrease(line.item.id)} className="px-2 rounded bg-slate-200">-</button>
                  <span>{line.quantity}</span>
                  <button onClick={() => increase(line.item.id)} className="px-2 rounded bg-slate-200">+</button>
                </div>
                <button onClick={() => remove(line.item.id)} className="text-red-500 text-sm">Remove</button>
              </div>
            </div>
          ))}
          {!lines.length && <p className="text-slate-400">No items in cart.</p>}
        </div>
        <p className="text-2xl font-black my-4">Total: ₹{total().toFixed(2)}</p>
        <button disabled={!lines.length} onClick={() => setShowCheckout(true)} className="w-full rounded-xl bg-brandPurple text-white py-3 font-bold disabled:opacity-40">Generate Bill</button>
      </aside>

      {showCheckout && (
        <div className="fixed inset-0 bg-black/50 grid place-items-center">
          <div className="bg-white p-6 rounded-2xl w-full max-w-sm space-y-4">
            <h3 className="text-xl font-bold">Select Payment Mode</h3>
            <div className="grid grid-cols-2 gap-2">
              <button onClick={() => setPaymentMode('CASH')} className={`py-3 rounded-lg ${paymentMode === 'CASH' ? 'bg-brandOrange text-white' : 'bg-slate-100'}`}>Cash</button>
              <button onClick={() => setPaymentMode('UPI')} className={`py-3 rounded-lg ${paymentMode === 'UPI' ? 'bg-brandOrange text-white' : 'bg-slate-100'}`}>UPI</button>
            </div>
            <button disabled={saving} onClick={checkout} className="w-full py-3 bg-brandPurple text-white rounded-lg font-bold">{saving ? 'Saving...' : 'Confirm & Save'}</button>
            <button onClick={() => setShowCheckout(false)} className="w-full py-2 text-slate-500">Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}
