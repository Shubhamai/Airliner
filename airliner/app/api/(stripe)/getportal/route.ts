import { NextRequest, NextResponse } from 'next/server';
import { Response } from '@/utils/response';
import { Stripe } from 'stripe';

export const runtime = 'edge';
const STRIPE_SECRET_KEY: string = process.env.STRIPE_SECRET_KEY as string;

const stripe = new Stripe(STRIPE_SECRET_KEY, {
	apiVersion: '2023-08-16'
});

export async function POST(req: NextRequest) {
	const request = await req.json();

	let response;

	try {
		const session = await stripe.billingPortal.sessions.create({
			customer: request.customerId,
			return_url: `${process.env.NEXT_PUBLIC_PUBLIC_ORIGIN}/dashboard`
					
		});

		response = Response.Success(session.url);
	} catch (error: any) {
		response = Response.Error(error);
	}

	return NextResponse.json(response, {
		status: 200,
		headers: {
			'Access-Control-Allow-Origin':
				process.env.NODE_ENV === 'development' ? '*' : 'https://airliner.app', // TODO : Change to airliner.app
			'Access-Control-Allow-Methods': 'GET',
			'Access-Control-Allow-Headers': 'Content-Type, Authorization'
		}
	});
}
