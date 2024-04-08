'use client';

import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';
import { useAppState } from '@/state/appState';
import { redirectToDownload } from '@/utils/helpers';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Stripe from 'stripe';

type ProductData = {
	productData: Stripe.Price;
};

enum DownloadType {
	FREE = 'Download',
	SUBSCRIBE = 'Subscribe'
}

const ProductCard = (props: ProductData) => {
	const router = useRouter();
	const { toast } = useToast();
	const { userStatus, user } = useAppState();

	const { productData } = props;
	const { unit_amount: cost, currency, product: productInfo } = productData;

	// TODO : ?? 0 is a hacky way to get around the fact that cost is sometimes undefined
	const costInDollars = (cost ?? 0) / 100;

	if (typeof productInfo === 'string') return null;

	const { name, metadata } = productInfo as unknown as {
		name: string;
		metadata: { bad: string; good: string };
	};

	const badFeatures = metadata.bad?.split('|') ?? [];
	const goodFeatures = metadata.good?.split('|') ?? [];

	const downloadText = costInDollars === 0 ? DownloadType.FREE : DownloadType.SUBSCRIBE;

	const handleButtonClick = async () => {
		if (costInDollars === 0) {
			// TODO : download
			redirectToDownload(router);
		} else {
			if (user) {
				

				const res = await fetch(
					`${
						process.env.NODE_ENV === 'production' ? 'https://airliner.app' : 'http://localhost:3000'
					}/api/payment`,
					{
						method: 'POST',
						headers: {
							'Content-Type': 'application/json'
						},
						body: JSON.stringify({ priceId: productData.id, user : user })
					}
				);

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
				toast({
					title: 'Please Log In.',
					description: 'You are not logged in. Please log in to continue.' // TODO : vercel.com/design/error
				});
				router.push(`/get-started`);
			}
		}
	};

	return (
		<Card className="flex flex-col gap-5 w-full">
			<CardHeader>
				<div className="flex flex-col gap-y-8">
					<CardTitle className="uppercase text-2xl">{name}</CardTitle>
					<div className="flex gap-2 items-center">
						<h2 className="text-4xl font-bold text-center">
							{costInDollars.toLocaleString('en-US', {
								style: 'currency',
								currency: currency,
								minimumFractionDigits: 0
							})}
						</h2>
						<h4 className="text-base font-medium text-center">/ month</h4>
					</div>
					<Separator className="my-4" />
					<h4 className="text-base font-medium">What&apos;s included</h4>
					<ul className="list-none list-inside list-image-none space-y-2">
						{/* <li className="flex flex-row gap-2">
							<Image src="check-circled.svg" width={18} height={18} alt='Check Icon' /> Same set of features as Pro
						</li>
						<li>Available even when demand is high</li> */}
						{goodFeatures.map((features: string, i: number) => (
							<li key={i} className="flex flex-row gap-2">
								<Image src="check-circled.svg" width={18} height={18} alt="Check Icon" /> {features}
							</li>
						))}
						{badFeatures.map((features: string, i: number) => (
							<li key={i} className="flex flex-row gap-2">
								<Image src="cross-circled.svg" width={18} height={18} alt="Cross Icon" /> {features}
							</li>
						))}
					</ul>
				</div>

				{/* <CardDescription>{description}</CardDescription> */}
			</CardHeader>
			<CardContent className="mb-0">
				{/* <p>Card Content</p> */}
				<Button className="w-full mb-0" onClick={handleButtonClick}>
					{downloadText}
				</Button>
			</CardContent>
			{/* <CardFooter></CardFooter> */}
		</Card>
	);
};

export default ProductCard;
