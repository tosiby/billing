'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Item } from '@/lib/types';

export default function InventoryPage() {
  const [items, setItems] = useState<Item[]>([]);

  async function load() {
    const result = await api<Item[]>('/items');
    setItems(result);
  }

  useEffect(() => {
    load();
  }, []);

  async function save(item: Item) {
    await api(`/items/${item.id}`, { method: 'PUT', body: JSON.stringify({ stock: item.stock, lowStockLevel: item.lowStockLevel, price: item.price, isActive: item.isActive }) });
    load();
  }

  return (
    <div className="space-y-3">
      <h2 className="text-2xl font-bold">Inventory</h2>
      <div className="space-y-2">
        {items.map((item) => (
          <div key={item.id} className="pos-card p-3 flex flex-wrap gap-2 items-center justify-between">
            <div>
              <p className="font-semibold">{item.name}</p>
              <p className="text-sm text-slate-500">{item.category}</p>
            </div>
            <div className="flex items-center gap-2">
              <input type="number" className="border rounded px-2 py-1 w-20" value={item.stock} onChange={(e) => setItems((prev) => prev.map((p) => p.id === item.id ? { ...p, stock: Number(e.target.value) } : p))} />
              <input type="number" className="border rounded px-2 py-1 w-16" value={item.lowStockLevel} onChange={(e) => setItems((prev) => prev.map((p) => p.id === item.id ? { ...p, lowStockLevel: Number(e.target.value) } : p))} />
              {item.stock <= item.lowStockLevel && <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded">Low Stock</span>}
              <button onClick={() => save(item)} className="px-3 py-1 rounded bg-brandPurple text-white">Save</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
