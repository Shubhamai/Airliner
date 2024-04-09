'use client';

import { Button } from '@/components/ui/button';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'


import { useToast } from '@/components/ui/use-toast';
import {
	ChevronRight,
	TowerControl,
	User2,
	Infinity,
	Cloud,
	FastForward,
	ArrowDownToLine,
	Mail
} from 'lucide-react';
import Link from 'next/link';
import { useAppState } from '@/state/appState';

export default function Home() {
	const { toast } = useToast();
	const router = useRouter()
	const {  userStatus } = useAppState();

	const [email, setEmail] = useState('');
	const [request, setRequest] = useState('');

	return (
		<div className="flex flex-col items-center justify-between min-h-screen py-4">
			<header className="flex flex-row items-center gap-3 justify-between w-full px-44">
				<div></div>
				<Link href="/" className="font-bold text-xl">
					Airliner
				</Link>
				{/* <Link href="/pricing">Pricing</Link> */}
				<div></div>
			</header>
			<div className="flex flex-col justify-between">
				<main className="flex px-4 max-w-[1600px] gap-10">
					<div className="flex flex-col gap-5 mt-7">
						<h1 className={cn('text-5xl font-extrabold', 'pb-4 text-foreground')}>
							CoPilot and Virtual ATC <br /> for Microsoft Flight Simulator
						</h1>
						<h4 className="text-lg w-3/4 font-medium pb-4 text-foreground/60">
							Communicate with your virtual ATC using voice, and ask anything based on your simbrief
							flight plan.
						</h4>
						{/* <div className="flex flex-row gap-4"> */}
						<div
							className="flex flex-row gap-4"
						>
							<Button
								className="flex gap-2 rounded-3xl border-2 pl-6 pr-4 border-foreground font-bold hover:shadow-xl transition-shadow"
								type="submit"
								onClick={() => {
									// redirect to https://github.com/shubhamai/airliner, in a new tab
									window.open('https://github.com/Shubhamai/Airliner/releases', '_blank');
								}}

							>
								Download for Windows
								<ChevronRight />
							</Button>
							{/* {userStatus === 'user' ? (
					<Button asChild>
						<Link href="/dashboard" className="text-sm">
							Dashboard
						</Link>
					</Button>
				) : (
					<div className="flex gap-3">
						<Button variant="secondary" className='rounded-full' asChild>
							<Link href="/get-started" className="text-sm">
								Log In
							</Link>
						</Button>
					</div>
				)} */}
						</div>
						{/* <Link href="/get-started">
								<Button
									className="flex gap-2 w-fit rounded-3xl border-2 pl-6 pr-4 border-foreground font-bold hover:shadow-xl transition-shadow"
									size="lg"
									// variant={'ghost'}
								>
									Get Started
									<ChevronRight />
								</Button>
							</Link> */}
						{/* <Button
								className="flex gap-2 w-fit rounded-3xl border-2 pl-5 pr-5 border-foreground/10 font-bold hover:shadow-xl transition-shadow"
								size="lg"
								variant={'secondary'}
								// variant={'ghost'}
							>
								Download
								<ArrowDownToLine size={18} />
							</Button> */}
						{/* </div> */}
						<div className="grid grid-cols-2 grid-rows-2 gap-x-24 gap-y-10 mt-10 w-[800px]">
							<div>
								<h1 className="flex items-center gap-1 font-semibold text-foreground">
									<User2 size={15} className="mb-1" /> Realistic ATC
								</h1>
								<h4 className="text-foreground/70">
									Interact with your virtual ATC using voice or text & get responses in voice or
									text.
								</h4>
							</div>
							<div>
								<h1 className="flex items-center gap-1 font-semibold text-foreground">
									<Infinity size={16} /> Unlimited Flight Plans
								</h1>
								<h4 className="text-foreground/70">
									Interact with your virtual ATC using any flight plan from SimBrief.
								</h4>
							</div>
							<div>
								<h1 className="flex items-center gap-1 font-semibold text-foreground">
									<Cloud size={16} /> On Cloud Storage
								</h1>
								<h4 className="text-foreground/70">
									Your data is saved on the cloud, so you can access it from anywhere.
								</h4>
							</div>
							<div>
								<h1 className="flex items-center gap-1 font-semibold text-foreground">
									<FastForward size={16} /> No Frame Rate Loss
								</h1>
								<h4 className="text-foreground/70">
									All the processing is done on the cloud, so you don&apos;t have to worry about
									losing frames.
								</h4>
							</div>
						</div>
					</div>
					<Dialog>
						<DialogTrigger asChild>
							<div className="flex flex-col items-center gap-2 w-[1400px]">
								<Image
									className="rounded-xl shadow-lg"
									src="/application.png"
									alt="A screenshot of the application"
									width="700"
									height="700"
									quality={100}
									priority={true}
								/>
								{/* <div className="font-light text-sm text-foreground/70">
									A screenshot of the application [last updated - August 17, 2023]
								</div> */}
							</div>
						</DialogTrigger>
						<DialogContent className="w-fit max-w-4xl">
							<Image
								className="rounded-xl"
								src="/application.png"
								alt="A screenshot of the application"
								width="1200"
								height="1200"
								quality={100}
								priority={true}
							/>
						</DialogContent>
					</Dialog>
				</main>
			</div>
			<footer className="flex flex-row gap-3 items-center">
				<Link href="https://github.com/Shubhamai/Airliner">
					github.com/Shubhamai/Airliner
				</Link>
			</footer>
		</div>
	);
}
