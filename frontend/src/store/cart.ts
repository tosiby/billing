'use client';

import { create } from 'zustand';
import { Item } from '@/lib/types';

type CartLine = { item: Item; quantity: number };

type CartState = {
  lines: CartLine[];
  addItem: (item: Item) => void;
  increase: (itemId: number) => void;
  decrease: (itemId: number) => void;
  remove: (itemId: number) => void;
  clear: () => void;
  total: () => number;
};

export const useCartStore = create<CartState>((set, get) => ({
  lines: [],
  addItem: (item) => set((state) => {
    const found = state.lines.find((l) => l.item.id === item.id);
    if (found) {
      return { lines: state.lines.map((l) => l.item.id === item.id ? { ...l, quantity: l.quantity + 1 } : l) };
    }
    return { lines: [...state.lines, { item, quantity: 1 }] };
  }),
  increase: (itemId) => set((state) => ({ lines: state.lines.map((l) => l.item.id === itemId ? { ...l, quantity: l.quantity + 1 } : l) })),
  decrease: (itemId) => set((state) => ({ lines: state.lines.flatMap((l) => l.item.id !== itemId ? l : (l.quantity <= 1 ? [] : { ...l, quantity: l.quantity - 1 })) })),
  remove: (itemId) => set((state) => ({ lines: state.lines.filter((l) => l.item.id !== itemId) })),
  clear: () => set({ lines: [] }),
  total: () => get().lines.reduce((sum, l) => sum + l.item.price * l.quantity, 0),
}));
