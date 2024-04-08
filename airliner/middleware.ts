import { NextRequest, NextResponse } from 'next/server';
import { Ratelimit } from '@upstash/ratelimit';
import { kv } from '@vercel/kv';
import Stripe from 'stripe';
import { jwtVerify } from 'jose'

export const config = {
	matcher: ['/api/answer', '/api/speech', '/api/transcript'], // TODO : Unintended side effect, when /api/transcript and /api/answer have different ratelimits, /api/transcript passes the ratelimit, while /api/answer for the same IP fails
	regions: ['iad1'] // NOTE : Same as the redis database region, Washington, D.C., USA
};

const ratelimit = new Ratelimit({
	redis: kv,
	limiter: Ratelimit.slidingWindow(6, '10 s'), // TODO : Maybe a token bucket algorithm would be better
	analytics: true
});

const STRIPE_SECRET_KEY: string = process.env.STRIPE_SECRET_KEY as string;
const stripe = new Stripe(STRIPE_SECRET_KEY, {
	apiVersion: '2023-08-16'
});

export default async function middleware(request: NextRequest): Promise<Response | undefined> { 	
	if (request.method === 'OPTIONS') {
		return NextResponse.next();
	} else if (request.method === 'POST') {


		const authorizationToken = request.headers.get('Authorization');
		if (!authorizationToken) {
			return new NextResponse('Authorization header missing', {
				status: 401,
				headers: {
					'Access-Control-Allow-Origin': '*',
					'Access-Control-Allow-Methods': 'POST, OPTIONS',
					'Access-Control-Allow-Headers': 'Content-Type, Authorization, stripeCustomerId'
				}
			});
		} 
	

		const verified = await jwtVerify(
			authorizationToken,
			new TextEncoder().encode(process.env.SUPABASE_JWT_SECRET)
		  )
		const user =  verified.payload;

		if (!user.sub) {
			return new NextResponse('Incorrect authorization.', {
				status: 401,
				headers: {
					'Access-Control-Allow-Origin': '*',
					'Access-Control-Allow-Methods': 'POST, OPTIONS',
					'Access-Control-Allow-Headers': 'Content-Type, Authorization, stripeCustomerId'
				}
			});
		}

				const { success, pending, limit, reset, remaining } = await ratelimit.limit(user.sub);

				return success
					? NextResponse.next()
					: new NextResponse('Too many requests, please try again in few seconds', {
							status: 429,

							headers: {
								'Access-Control-Allow-Origin': '*',
								'Access-Control-Allow-Methods': 'POST, OPTIONS',
								'Access-Control-Allow-Headers': 'Content-Type, Authorization, stripeCustomerId'
							}
					  });
			
		}
	}
}
