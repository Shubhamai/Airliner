'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FormEvent, useEffect, useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { redirectToDashboard, inputNames } from '../utils';
// import { GoogleAuthButton } from '../googleAuth';
import { useAppState } from '@/state/appState';
import { ChevronLeft } from 'lucide-react';
import { Label } from '@/components/ui/label';
import Image from 'next/image';
import { Separator } from '@/components/ui/separator';
import { supabase } from '@/utils/supabase';

const userNames = [
	// Bird-Themed
	'SkyLark',
	'FlyRobin',
	'EagleEye',

	// Airplane & Tech-Themed
	'JetZoom',
	'FlyTech9',
	'AirShift',

	// Sky & Cloud-Themed
	'SkyQuest',
	'Cloud9er',
	'StratoHop',

	// Space Exploration-Themed
	'StarSail',
	'MoonWalk',
	'OrbitRun',

	// Adventurous & Mystical-Themed
	'SkySeekr',
	'WindRide',
	'MystFlyer',

	// Historical & Legendary
	'DaVinci8',
	'WrightFly',
	'IcarusUp'
];

export default function GetStarted() {
	const { toast } = useToast();
	const router = useRouter();
	// const context = useAppContext();
	const { userStatus } = useAppState();

	const onEmailFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		const data = new FormData(event.currentTarget);
		try {
			if (!data) {
				return;
			}

			const { data: SupabaseData, error } = await supabase.auth.signInWithOtp({
				email: `${data.get(inputNames.email)}`,
				options: {
					emailRedirectTo: `${process.env.NEXT_PUBLIC_PUBLIC_ORIGIN}/get-started`
				}
			});

			toast({
				title: 'Email sent!',
				description: 'We have sent you an email to log in to your account.'
			});
		} catch (error: any) {
			toast({
				title: 'Uh oh! Something went wrong.',
				description: error.message // TODO : vercel.com/design/error
			});
		}
	};

	// TODO: Need fixing when user tries to login, but still gets toast message
	useEffect(() => {
		console.log('userStatus', userStatus);
		if (userStatus === 'user') {
			redirectToDashboard(router);
			toast({
				title: 'You are already logged in.',
				description: 'You are already logged in. Redirecting you to the dashboard.'
			});
		}
	}, [userStatus]);

	return (
		<ConfirmEmail>
			<div className="flex flex-col gap-10 items-center justify-center mx-auto min-h-screen w-[400px]">
				<Link
					href={'/'}
					className="absolute left-8 top-12 rounded-full flex flex-row text-sm text-foreground/80 items-center gap-1"
				>
					<ChevronLeft size={16} /> <div>Home</div>
				</Link>
				<div className="flex flex-col gap-2 w-full">
					<h1 className="text-2xl font-bold text-left w-full">Get started</h1>
					<h4 className="text-left">We will send you a magic link to log in.</h4>
				</div>
				<div className="flex flex-col gap-5 w-full">
					<form onSubmit={onEmailFormSubmit} className="flex flex-col gap-3 w-full">
						<div className="flex flex-col gap-6">
							{/* <div className="flex flex-col gap-2">
								<Label className="text-foreground/70">Name</Label>
								<Input id="name" placeholder="Enter your name" type="text" required />
							</div> */}
							<div className="flex flex-col gap-2">
								<Label className="text-foreground/70">Email Address</Label>
								<Input
									id="email"
									name="email"
									placeholder="Enter your email"
									type="email"
									required
								/>
							</div>
							<Button
								type={'submit'}
								// disabled={loading}
								className="flex flex-row items-center justify-center gap-3"
							>
								{/* <div>{loading ? <Loader className="animate-spin" /> : <></>}</div> */}
								Send Magic Link
								<div>{<></>}</div>
							</Button>
						</div>
					</form>
					<div className="flex flex-col gap-4 items-center justify-center w-full"></div>
				</div>
			</div>
		</ConfirmEmail>
	);
}

const ConfirmEmail = ({ children }: { children: React.ReactNode }) => {
	const [localEmailStatus, setLocalEmailStatus] = useState<'un-defined' | 'not-found' | 'found'>(
		'un-defined'
	);
	const [localEmail, setLocalEmail] = useState('');

	const router = useRouter();

	const { toast } = useToast();
	useEffect(() => {
		if (typeof window !== 'undefined') {
			if (localEmailStatus === 'un-defined') {
				const localStorageEmail = window.localStorage.getItem('emailForSignIn');

				if (localStorageEmail) {
					setLocalEmailStatus('found');
					setLocalEmail(localStorageEmail);
				} else {
					setLocalEmailStatus('not-found');
				}
			}
		}
		// eslint-disable-next-line no-sparse-arrays
	}, [, localEmailStatus]);

	return <>{children}</>;
};
