import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useAuthStore = create(
  persist(
    (set) => ({
      token: null,
      user: null,

      setAuth: (token, user) => set({ token, user }),

      updateUser: (updates) =>
        set((state) => ({ user: { ...state.user, ...updates } })),

      logout: () => set({ token: null, user: null }),
    }),
    {
      name: 'bose-auth',
      partialize: (state) => ({ token: state.token, user: state.user }),
    }
  )
)
