'use client';

import { create } from 'zustand';
import { User } from '@/lib/types';

type AuthState = {
  user: User | null;
  token: string | null;
  setAuth: (token: string, user: User) => void;
  logout: () => void;
  hydrate: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  setAuth: (token, user) => {
    localStorage.setItem('ice_spot_token', token);
    localStorage.setItem('ice_spot_user', JSON.stringify(user));
    set({ token, user });
  },
  logout: () => {
    localStorage.removeItem('ice_spot_token');
    localStorage.removeItem('ice_spot_user');
    set({ token: null, user: null });
  },
  hydrate: () => {
    const token = localStorage.getItem('ice_spot_token');
    const userRaw = localStorage.getItem('ice_spot_user');
    set({ token, user: userRaw ? JSON.parse(userRaw) : null });
  },
}));
