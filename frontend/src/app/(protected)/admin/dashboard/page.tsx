'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';

interface Summary {
  todayTotalSales: number;
  todayCashTotal: number;
  todayUpiTotal: number;
  billsToday: number;
  topItems: { itemId: number; name: string; quantity: number }[];
}

export default function DashboardPage() {
  const [data, setData] = useState<Summary | null>(null);

  useEffect(() => {
    api<Summary>('/dashboard/summary').then(setData).catch(console.error);
  }, []);

  if (!data) return <div>Loading dashboard...</div>;

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Daily Sales Dashboard</h2>
      <div className="grid md:grid-cols-4 gap-3">
        <Stat label="Today Total" value={`₹${data.todayTotalSales.toFixed(2)}`} />
        <Stat label="Cash" value={`₹${data.todayCashTotal.toFixed(2)}`} />
        <Stat label="UPI" value={`₹${data.todayUpiTotal.toFixed(2)}`} />
        <Stat label="Bills" value={String(data.billsToday)} />
      </div>
      <div className="pos-card p-4">
        <h3 className="font-bold mb-2">Top Selling Items</h3>
        <ul className="space-y-2">
          {data.topItems.map((item) => <li key={item.itemId} className="flex justify-between border-b pb-1"><span>{item.name}</span><strong>{item.quantity}</strong></li>)}
        </ul>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return <div className="pos-card p-4"><p className="text-sm text-slate-500">{label}</p><p className="text-2xl font-black text-brandPurple">{value}</p></div>;
}
