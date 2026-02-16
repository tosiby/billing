'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import clsx from 'clsx';
import { useAuthStore } from '@/store/auth';

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const { user, hydrate, logout } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  useEffect(() => {
    if (!localStorage.getItem('ice_spot_token')) router.push('/login');
  }, [router]);

  const links = [
    { href: '/pos', label: 'POS' },
    ...(user?.role === 'ADMIN'
      ? [
          { href: '/admin/dashboard', label: 'Dashboard' },
          { href: '/admin/inventory', label: 'Inventory' },
          { href: '/admin/staff', label: 'Staff' },
        ]
      : []),
  ];

  return (
    <div className="min-h-screen">
      <header className="bg-white border-b p-3 flex justify-between items-center sticky top-0 z-20">
        <div>
          <h1 className="font-black text-brandPurple">ICE SPOT POS</h1>
          <p className="text-xs text-slate-500">{user?.name || '...'}</p>
        </div>
        <div className="flex items-center gap-2">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className={clsx('px-3 py-2 rounded-lg text-sm font-semibold', pathname === l.href ? 'bg-brandPurple text-white' : 'bg-slate-100')}>
              {l.label}
            </Link>
          ))}
          <button onClick={() => { logout(); router.push('/login'); }} className="px-3 py-2 bg-red-100 text-red-700 rounded-lg text-sm font-semibold">Logout</button>
        </div>
      </header>
      <div className="p-4">{children}</div>
    </div>
  );
}
