import { create } from 'zustand';
import api from '../services/api';

const useAuthStore = create((set) => ({
    user: JSON.parse(localStorage.getItem('user')) || null,
    token: localStorage.getItem('token') || null,
    isLoading: false,
    error: null,

    // Method to set user and token explicitly
    setAuth: (user, token) => {
        localStorage.setItem('user', JSON.stringify(user));
        if (token) localStorage.setItem('token', token);
        set({ user, token: token || localStorage.getItem('token'), error: null });
    },

    // Logout
    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        set({ user: null, token: null, error: null });
    },

    // Login standard
    login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
            const { data } = await api.post('/auth/login', { email, password });
            if (data.success) {
                localStorage.setItem('token', data.token);
                // Ensuite on fetch `me` pour peupler le store
                const meRes = await api.get('/auth/me');
                if (meRes.data.success) {
                    localStorage.setItem('user', JSON.stringify(meRes.data.data));
                    set({ user: meRes.data.data, token: data.token, isLoading: false });
                    return true;
                }
            }
            return false;
        } catch (error) {
            set({
                isLoading: false,
                error: error.response?.data?.message || 'Erreur lors de la connexion'
            });
            return false;
        }
    },
}));

export default useAuthStore;
