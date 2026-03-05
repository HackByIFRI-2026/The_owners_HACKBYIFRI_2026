import { create } from 'zustand';

const useThemeStore = create((set) => ({
    theme: localStorage.getItem('theme') || 'dark',
    toggleTheme: () => set((state) => {
        const newTheme = state.theme === 'dark' ? 'light' : 'dark';
        localStorage.setItem('theme', newTheme);
        if (newTheme === 'light') {
            document.documentElement.classList.add('light');
        } else {
            document.documentElement.classList.remove('light');
        }
        return { theme: newTheme };
    }),
    initTheme: () => {
        const saved = localStorage.getItem('theme') || 'dark';
        if (saved === 'light') document.documentElement.classList.add('light');
        return saved;
    },
}));

export default useThemeStore;
