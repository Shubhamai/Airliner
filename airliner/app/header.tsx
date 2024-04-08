'use client';

import Link from 'next/link';
import { useAppState } from '@/state/appState';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export const Header = () => {
	const {  userStatus } = useAppState();

	return (
		<div className="fixed top-5 flex flex-row items-center w-full px-4 max-w-[1400px] justify-between">
			<Link href="/" className="text-2xl font-bold">
				Airliner
			</Link>

			<div className="flex gap-10 items-center">
				{/* <NavigationMenuItem>
						<Link href="/changelog" legacyBehavior passHref>
							<NavigationMenuLink className={navigationMenuTriggerStyle()}>
								Changelog
							</NavigationMenuLink>
						</Link>
					</NavigationMenuItem> */}

				<Link href="/pricing" className="text-sm">
					Pricing
				</Link>

				{userStatus === 'user' ? (
					<Button asChild>
						<Link href="/dashboard" className="text-sm">
							Dashboard
						</Link>
					</Button>
				) : (
					<div className="flex gap-3">
						<Button variant="secondary" asChild>
							<Link href="/get-started" className="text-sm">
								Log In
							</Link>
						</Button>
					</div>
				)}
			</div>
		</div>
	);
};
