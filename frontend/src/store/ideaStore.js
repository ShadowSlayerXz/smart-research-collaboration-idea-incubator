import { create } from 'zustand';
import axiosInstance from '../api/axiosInstance';

export const useIdeaStore = create((set, get) => ({
  ideas: [],
  total: 0,
  page: 1,
  pages: 1,
  loading: false,
  filters: { keyword: '', category: '', status: '' },

  setFilters: (filters) => set({ filters: { ...get().filters, ...filters }, page: 1 }),
  setPage: (page) => set({ page }),

  fetchIdeas: async () => {
    set({ loading: true });
    const { filters, page } = get();
    const params = new URLSearchParams({ ...filters, page, limit: 9 });
    const { data } = await axiosInstance.get(`/api/ideas?${params}`);
    set({ ideas: data.ideas, total: data.total, page: data.page, pages: data.pages, loading: false });
  },

  createIdea: async (ideaData) => {
    const { data } = await axiosInstance.post('/api/ideas', ideaData);
    return data;
  },

  updateIdea: async (id, ideaData) => {
    const { data } = await axiosInstance.put(`/api/ideas/${id}`, ideaData);
    return data;
  },

  deleteIdea: async (id) => {
    await axiosInstance.delete(`/api/ideas/${id}`);
    set((state) => ({ ideas: state.ideas.filter((i) => i._id !== id) }));
  },
}));
