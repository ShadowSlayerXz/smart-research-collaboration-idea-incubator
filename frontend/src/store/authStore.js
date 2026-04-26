import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axiosInstance from '../api/axiosInstance';

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,

      login: async (email, password) => {
        const { data } = await axiosInstance.post('/api/auth/login', { email, password });
        set({ user: data, token: data.token });
        return data;
      },

      register: async (formData) => {
        const { data } = await axiosInstance.post('/api/auth/register', formData);
        set({ user: data, token: data.token });
        return data;
      },

      logout: () => set({ user: null, token: null }),

      updateUser: (userData) =>
        set((state) => ({ user: { ...state.user, ...userData } })),
    }),
    { name: 'auth-storage' }
  )
);
