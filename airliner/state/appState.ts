import { User } from '@supabase/supabase-js';
import { create } from 'zustand';

type appState = {
	user: User | null;
	userStatus: 'not-defined' | 'user' | 'no-user';
	setUser: (user: User | null) => void;
	setUserStatus: (userStatus: 'not-defined' | 'user' | 'no-user') => void;
};

export const useAppState = create<appState>((set) => ({
	user: null,
	userStatus: 'not-defined',
	setUser: (user: User | null) => set({ user: user }),
	setUserStatus: (userStatus: 'not-defined' | 'user' | 'no-user') => set({ userStatus: userStatus })
}));
