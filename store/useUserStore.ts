
import { create } from 'zustand';
import Cookies from 'js-cookie';
import api from '@/lib/api';
import { jwtDecode } from "jwt-decode";

interface User {
  id: string;
  email: string;
}

interface UserState {
  user: User | null;
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
  checkAuth: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  isAuthenticated: false,

  login: (token: string) => {
    Cookies.set('accessToken', token);
    const decoded: any = jwtDecode(token);
    set({ 
      isAuthenticated: true, 
      user: { id: decoded.sub, email: decoded.email } 
    });
  },

  logout: () => {
    Cookies.remove('accessToken');
    set({ isAuthenticated: false, user: null });
  },

  checkAuth: () => {
    const token = Cookies.get('accessToken');
    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        set({ 
          isAuthenticated: true, 
          user: { id: decoded.sub, email: decoded.email } 
        });
      } catch (e) {
        Cookies.remove('accessToken');
        set({ isAuthenticated: false, user: null });
      }
    }
  }
}));
