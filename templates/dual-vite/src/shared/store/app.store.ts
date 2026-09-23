import { create } from "zustand";

export type AppTheme = "light" | "dark";
const storageKey = "dual-vite:theme";
const initialTheme = (): AppTheme => typeof window !== "undefined" && window.localStorage.getItem(storageKey) === "light" ? "light" : "dark";

interface AppState { theme: AppTheme; setTheme: (theme: AppTheme) => void; toggleTheme: () => void }
export const useAppStore = create<AppState>((set, get) => ({
  theme: initialTheme(),
  setTheme: (theme) => { window.localStorage.setItem(storageKey, theme); set({ theme }); },
  toggleTheme: () => get().setTheme(get().theme === "dark" ? "light" : "dark"),
}));
