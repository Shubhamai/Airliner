'use client';

import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger
} from '@/components/ui/accordion';
import ProductCard from './productCard';
import Stripe from 'stripe';
import { useEffect, useState } from 'react';

export default function Pricing() {
	const [products, setProducts] = useState<Stripe.Price[]>([]);

	useEffect(() => {
		const fetchProducts = async () => {
			const res = await fetch(`${process.env.NEXT_PUBLIC_PUBLIC_ORIGIN}/api/getproducts`, {
				cache: 'no-cache'
			});

			const data = await res.json();
			const products = data.data;
			setProducts(products);
		};

		fetchProducts();
	}, []);

	return (
		<div className="space-y-24">
			<h1 className="text-4xl font-bold text-center">Pricing</h1>
			{/* <h4 className="text-base text-center">Start for free</h4> */}
			<div className="flex flex-row gap-x-16">
				{products.map((product: Stripe.Price, productIndex: number) => {
					return <ProductCard key={productIndex} productData={product} />;
				})}
			</div>

			<div className="flex flex-col space-y-20 items-center">
				<h1 className="text-4xl font-bold text-center">FAQs</h1>
				<Accordion type="single" collapsible className="w-[800px]">
					<AccordionItem value="item-1">
						<AccordionTrigger>What is rate limiting?</AccordionTrigger>
						<AccordionContent>
							Rate limiting is a mechanism that allows you to control how many requests per second
							can be made to an API.
						</AccordionContent>
					</AccordionItem>
				</Accordion>
			</div>
		</div>
	);
}
