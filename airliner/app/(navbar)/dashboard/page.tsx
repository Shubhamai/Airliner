'use client';

import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useAppState } from '@/state/appState';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger
} from '@/components/ui/dialog';

import { CalendarCheck2, ChevronLeft, DeleteIcon, LogOutIcon } from 'lucide-react';
import Link from 'next/link';
import { supabase } from '@/utils/supabase';

export default function Dashboard() {
	const { toast } = useToast();
	const router = useRouter();
	const searchParams = useSearchParams();

	const paymentSuccess = searchParams.get('success');
	const { userStatus, user } = useAppState();

	useEffect(() => {
		const handleSearchParams = async () => {
			if (paymentSuccess === 'true') {
				toast({
					title: 'Payment Successful',
					description: 'Your payment was successful.'
				});

				// const
			} else if (paymentSuccess === 'false') {
				toast({
					title: 'Payment Failed',
					description: 'Your payment failed.'
				});
			}

			if (userStatus === 'no-user') {
				toast({
					title: 'Please Log In.',
					description: 'You are not logged in. Please log in to continue.' // TODO : vercel.com/design/error
				});
				router.push('/get-started');
			}

			if (searchParams.get('token') === 'true') {
				if (user && userStatus === 'user') {
					const res = await fetch(`${process.env.NEXT_PUBLIC_PUBLIC_ORIGIN}/api/generateToken`, {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json'
						},
						body: JSON.stringify({ email: user.email })
					});

					const data = await res.json();
					const token = data.data;

					console.log(token);
					router.push(`airliner://?token=${token}`);
				} else {
					toast({
						title: 'Please Log In.',
						description: 'You are not logged in. Please log in to continue.' // TODO : vercel.com/design/error
					});
					// router.push('/login?token=true');
				}
			}
		};

		handleSearchParams();
	}, [userStatus, user, paymentSuccess]);

	const handleSignOut = async () => {
		supabase.auth
			.signOut()
			.then(() => {
				toast({
					title: 'Signed Out',
					description: 'You have been signed out.'
				});
				router.push('/');
			})
			.catch((error) => {
				toast({
					title: 'Error',
					description: error.message
				});
			});
	};

	const handleDeleteAccount = () => {
		// TODO : delete stripe subscription, send email confimation, delete account

		// const auth = getAuth();
		console.log('TODO, delete account task');
		// if (user) {
		// 	deleteUser(user)
		// 		.then(() => {
		// 			// User deleted.

		// 			toast({
		// 				title: 'Account Deleted',
		// 				description: 'Your account has been deleted.'
		// 			});

		// 			router.push('/');
		// 		})
		// 		.catch((error) => {
		// 			if (error.code === 'auth/requires-recent-login') {
		// 				// The user's credential is too old. She needs to sign in again.

		// 				signOut(auth)
		// 					.then(() => {
		// 						toast({
		// 							title: 'Error',
		// 							description:
		// 								'Your credential are too old. Please sign in again to delete your account.'
		// 						});

		// 						router.push('/get-started');
		// 					})
		// 					.catch((error) => {
		// 						toast({
		// 							title: 'Error',
		// 							description: error.message
		// 						});
		// 					});
		// 			} else {
		// 				toast({
		// 					title: 'Error',
		// 					description: error.message
		// 				});
		// 			}
		// 		});
		// } else {
		// 	toast({
		// 		title: 'Error',
		// 		description: 'You are not logged in.'
		// 	});
		// }
	};

	const handleManageSubscription = async () => {
		if (!user) {
			toast({
				title: 'Please Log In.',
				description: 'You are not logged in. Please log in to continue.' // TODO : vercel.com/design/error
			});
			router.push('/get-started');
			return;
		}

		if (user.user_metadata.stripeId) {
			const res = await fetch(`${process.env.NEXT_PUBLIC_PUBLIC_ORIGIN}/api/getportal`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ customerId: user.user_metadata.stripeId })
			});

			const data = await res.json();

			const url = data.data;

			if (userStatus === 'user') {
				router.push(url);
			} else {
				toast({
					title: 'Please Log In.',
					description: 'You are not logged in. Please log in to continue.' // TODO : vercel.com/design/error
				});
				router.push(`/get-started?redirectUrl=${url}`);
			}
		} else {
			// doc.data() will be undefined in this case
			// console.log('No such document!');
			toast({
				// title: "No Subscription Found!",
				description:
					'No subscription details found with given account. Please contact hello@airliner.app if you think this is a mistake.'
			});

			const res = await fetch(`${process.env.NEXT_PUBLIC_PUBLIC_ORIGIN}/api/payment`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ user: user })
			});

			const data = await res.json();

			const url = data.data;

			if (userStatus === 'user') {
				router.push(url);
			} else {
				toast({
					title: 'Please Log In.',
					description: 'You are not logged in. Please log in to continue.' // TODO : vercel.com/design/error
				});
				router.push(`/get-started?redirectUrl=${url}`);
			}
		}
	};

	return (
		<>
			{userStatus === 'user' ? (
				<div className="flex flex-col gap-10 justify-center mx-auto min-h-screen w-[800px]">
					<Link
						href={'/'}
						className="absolute left-8 top-12 rounded-full flex flex-row text-sm text-foreground/80 items-center gap-1"
					>
						<ChevronLeft size={16} /> <div>Home</div>
					</Link>
					<h1 className="text-3xl font-bold items-start text-center">
						Welcome to your account {user?.id}
					</h1>
					<div className="flex gap-2 justify-center">
						<Button onClick={handleManageSubscription}>
							<CalendarCheck2 className="w-4 h-4 mr-1" />
							Manage Subscription
						</Button>
						<Button variant="destructive" onClick={handleSignOut}>
							<LogOutIcon className="w-4 h-4 mr-1" />
							Sign Out
						</Button>
					</div>
					{/* 
					<div className="flex flex-col gap-2 border border-slate-200 rounded-md p-4">

						<h5 className="text-slate-500">
							Export your data to a CSV file. This will include all of your data including your
							personal data, subscription and payment details.
						</h5>

						<Button
							variant="outline"
							className="bg-transparent border-slate-300 hover:bg-slate-100 w-fit"
						>
							Export Data
						</Button>
					</div> */}

					<div className="flex flex-col gap-2 bg-red-50 border border-red-200 rounded-md p-4">
						<h1 className="font-bold text-red-950">Danger Zone</h1>

						<h5 className="text-slate-500">
							All of your data including your personal data, subscription and payment details will
							be wiped out immediatly
						</h5>
						<h5 className="font-medium">
							Once you delete your account, there is no going back. Please be certain.
						</h5>

						<Dialog>
							<DialogTrigger asChild>
								<Button
									variant="outline"
									className="bg-transparent border-red-300 hover:bg-red-100 w-fit"
								>
									Delete Account
								</Button>
							</DialogTrigger>
							<DialogContent className="flex flex-col gap-10">
								<DialogHeader className="flex flex-col gap-5">
									<DialogTitle>Are you absolutely sure?</DialogTitle>
									<DialogDescription>
										This action cannot be undone. This will permanently delete your account and
										remove your data from our servers, including your subscription and payment
										details.
									</DialogDescription>
								</DialogHeader>
								<DialogFooter>
									<Button variant="destructive" type="submit" onClick={handleDeleteAccount}>
										Confirm
									</Button>
								</DialogFooter>
							</DialogContent>
						</Dialog>
					</div>

				</div>
			) : (
				<div></div>
			)}
		</>
	);
}
