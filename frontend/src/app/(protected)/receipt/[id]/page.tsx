'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import { api } from '@/lib/api';
import { Sale } from '@/lib/types';

export default function ReceiptPage() {
  const params = useParams<{ id: string }>();
  const [sale, setSale] = useState<Sale | null>(null);

  useEffect(() => {
    api<Sale>(`/sales/${params.id}`).then(setSale).catch(console.error);
  }, [params.id]);

  const whatsAppLink = useMemo(() => {
    if (!sale) return '#';
    const body = [
      'ICE SPOT 🍦',
      `Bill: ${sale.billNumber}`,
      `Date: ${new Date(sale.createdAt).toLocaleString()}`,
      ...sale.items.map((i) => `${i.item.name} x${i.quantity} = ₹${(i.price * i.quantity).toFixed(2)}`),
      `Total: ₹${sale.totalAmount.toFixed(2)}`,
      `Payment: ${sale.paymentMode}`,
    ].join('\n');
    return `https://wa.me/?text=${encodeURIComponent(body)}`;
  }, [sale]);

  if (!sale) return <div>Loading receipt...</div>;

  return (
    <div className="max-w-xl mx-auto space-y-4">
      <div id="receipt" className="pos-card p-6 print:shadow-none print:border-0">
        <h1 className="text-2xl font-black text-center">ICE SPOT 🍦</h1>
        <p className="text-center text-sm text-slate-500 mb-4">Bill #{sale.billNumber}</p>
        <p>Date & Time: {new Date(sale.createdAt).toLocaleString()}</p>
        <p>Staff: {sale.staff.name}</p>
        <hr className="my-3" />
        {sale.items.map((line) => (
          <div key={line.id} className="flex justify-between text-sm py-1">
            <span>{line.item.name} x {line.quantity}</span>
            <span>₹{(line.price * line.quantity).toFixed(2)}</span>
          </div>
        ))}
        <hr className="my-3" />
        <p className="text-lg font-bold">Total: ₹{sale.totalAmount.toFixed(2)}</p>
        <p>Payment Mode: {sale.paymentMode}</p>
      </div>
      <div className="grid grid-cols-2 gap-2 print:hidden">
        <button onClick={() => window.print()} className="py-3 rounded-xl bg-brandPurple text-white font-semibold">Print Receipt</button>
        <a href={whatsAppLink} target="_blank" className="py-3 rounded-xl bg-green-500 text-white text-center font-semibold">Send via WhatsApp</a>
      </div>
    </div>
  );
}
