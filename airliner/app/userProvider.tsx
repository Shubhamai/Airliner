'use client';

import { useEffect } from 'react';
import { useAppState } from '../state/appState';
import { supabase } from '@/utils/supabase';

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
	const setUserStatus = useAppState((state) => state.setUserStatus);
	const setUser = useAppState((state) => state.setUser);

	supabase.auth.onAuthStateChange(async (event, session) => {
		if (event == 'SIGNED_IN') {
			const {
				data: { user }
			} = await supabase.auth.getUser();
			setUser(user);
			setUserStatus('user');
		}
	});

	useEffect(() => {
		const getUser = async () => {
			const {
				data: { user }
			} = await supabase.auth.getUser();

			if (user) {
				setUser(user);
				setUserStatus('user');
			} else {
				setUserStatus('no-user');
			}
		};

		getUser();
	}, []);

	return <>{children}</>;
};
