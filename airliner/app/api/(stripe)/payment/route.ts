import { NextRequest, NextResponse } from 'next/server';
import { Response } from '@/utils/response';
import { Stripe } from 'stripe';
import { User, createClient } from '@supabase/supabase-js';

const supabase = createClient(
	process.env.NEXT_PUBLIC_SUPABASE_URL as string,
	process.env.SUPABASE_SERVICE_ROLE_KEY as string,
	{
		auth: {
			autoRefreshToken: false,
			persistSession: false
		}
	}
);

const STRIPE_SECRET_KEY: string = process.env.STRIPE_SECRET_KEY as string;

const stripe = new Stripe(STRIPE_SECRET_KEY, {
	apiVersion: '2023-08-16'
});

const createOrRetrieveCustomer = async (user: User) => {
	if (user.user_metadata.stripeId) {
		return user.user_metadata.stripeId;
	} else {
		const customerData: { metadata: { id: string }; email: string; name: string } = {
			email: user.email as string,
			name: user.id as string,
			metadata: {
				id: user.id
			}
		};
		const customer = await stripe.customers.create(customerData);

		// setDoc(doc(fireStore, 'users', user.uid), {
		// 	email: user.email,
		// 	name: user.displayName,
		// 	stripeId: customer.id,
		// 	stripeLink: '',
		// 	uuid: user.uid
		// });

		// await fireStore.collection('users').doc(user.uid).set({
		// 	email: user.email,
		// 	name: user.displayName,
		// 	stripeId: ,
		// 	// stripeLink: '',
		// 	uuid: user.uid
		// });

		await supabase.auth.admin.updateUserById(user.id, { user_metadata: { stripeId: customer.id } });

		return customer.id;
	}
};

export async function POST(req: NextRequest) {
	const request = await req.json();

	const customer = await createOrRetrieveCustomer(request.user);

	const priceId = 'price_1NMWodSAFK7Q49VmJ9HMZ7Uh'; // request.priceId;

	let response;

	try {
		const session = await stripe.checkout.sessions.create({
			mode: 'subscription',
			customer,
			subscription_data: {
				metadata: {
					uuid: request.user.uid
				}
			},
			// payment_method_types: ['card', 'paypal'],
			line_items: [{ price: priceId, quantity: 1 }],
			success_url: `${process.env.NEXT_PUBLIC_PUBLIC_ORIGIN}/dashboard?session_id={CHECKOUT_SESSION_ID}&success=true`,
			cancel_url: `${process.env.NEXT_PUBLIC_PUBLIC_ORIGIN}/dashboard?success=false` // TODO : Maybe cancel=true;
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
			'Access-Control-Allow-Methods': 'POST',
			'Access-Control-Allow-Headers': 'Content-Type, Authorization'
		}
	});
}
