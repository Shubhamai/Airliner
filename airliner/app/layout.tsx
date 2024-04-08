import './globals.css';
import { B612 } from 'next/font/google';
import clsx from 'clsx';
import { Toaster } from '@/components/ui/toaster';
// import { UserProvider } from '@/hooks/appState';
import { Header } from './header';
import { ThemeProvider } from '@/components/ui/theme-provider';
import { UserProvider } from '@/app/userProvider';
import localFont from 'next/font/local';

// Font files can be colocated inside of `pages`
const cabinetGroteskFont = localFont({ src: './fonts/CabinetGrotesk-Variable.ttf' });
// const inter = B612({ subsets: ['latin'], weight: '400' });

export const metadata = {
	title: 'Airliner',
	description: ' CoPilot and Virtual ATC for Microsoft Flight Simulator'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<body className={clsx(cabinetGroteskFont.className, 'bg-white')}>
				{/* <div className="fixed inset-0 w-full h-full -z-10 bg-gradient-to-b from-transparent to-white">
					<div
						className="w-full h-full -z-20"
						style={{
							backgroundImage: 'url(/cloud.jpg)',
							backgroundRepeat: 'no-repeat',
							backgroundSize: 'cover',
							backgroundPosition: 'center'
						}}
					/>
				</div> */}

				<UserProvider>
					{/* <ThemeProvider attribute="class" defaultTheme="light" enableSystem> */}
					<main>
						{/* <Header /> */}
						{children}

						<Toaster />
					</main>
					{/* </ThemeProvider> */}
				</UserProvider>
			</body>
		</html>
	);
}
