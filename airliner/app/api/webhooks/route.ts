import Stripe from 'stripe';
import { headers } from 'next/headers';


const STRIPE_SECRET_KEY: string = process.env.STRIPE_SECRET_KEY as string;

const stripe = new Stripe(STRIPE_SECRET_KEY, {
	apiVersion: '2023-08-16'
});

const toDateTime = (secs: number) => {
	const t = new Date('1970-01-01T00:30:00Z'); // Unix epoch start.
	t.setSeconds(secs);
	return t;
};

const manageSubscriptionStatusChange = async (
	subscriptionId: string,
	customerId: string,
	createAction = false
) => {
	// const userRef = collection(fireStore, 'users');
	// const userQuery = query(userRef, where('stripeId', '==', customerId), limit(1));
	// const querySnapshot = await getDocs(userQuery);
	const querySnapshot = await fireStore.collection('users').where('stripeId', '==', customerId).limit(1).get();
	

	let uuid;
	querySnapshot.forEach((doc) => {
		uuid = doc.id;
	});

	if (!uuid) throw new Error(`No user found for Stripe customer [${customerId}]`);

	const subscription = await stripe.subscriptions.retrieve(subscriptionId, {
		expand: ['default_payment_method']
	});

	// Upsert the latest status of the subscription object.
	const subscriptionData = {
		id: subscription.id,
		user_id: uuid,
		metadata: subscription.metadata,
		status: subscription.status,
		price_id: subscription.items.data[0].price.id,
		//TODO check quantity on subscription
		// quantity: subscription.quantity,
		cancel_at_period_end: subscription.cancel_at_period_end,
		cancel_at: subscription.cancel_at ? toDateTime(subscription.cancel_at).toISOString() : null,
		canceled_at: subscription.canceled_at
			? toDateTime(subscription.canceled_at).toISOString()
			: null,
		current_period_start: toDateTime(subscription.current_period_start).toISOString(),
		current_period_end: toDateTime(subscription.current_period_end).toISOString(),
		created: toDateTime(subscription.created).toISOString(),
		ended_at: subscription.ended_at ? toDateTime(subscription.ended_at).toISOString() : null,
		trial_start: subscription.trial_start
			? toDateTime(subscription.trial_start).toISOString()
			: null,
		trial_end: subscription.trial_end ? toDateTime(subscription.trial_end).toISOString() : null
	};
	// const subscriptionRef = await addDoc(collection(fireStore, 'users', uuid, 'subscriptions'), subscriptionData);
	await fireStore.collection('users').doc(uuid).collection('subscriptions').doc(subscriptionData.id).set(subscriptionData);


	// For a new subscription copy the billing details to the customer object.
	// NOTE: This is a costly operation and should happen at the very end.
	// if (createAction && subscription.default_payment_method && uuid)
	// 	await copyBillingDetailsToCustomer(
	// 		uuid,
	// 		subscription.default_payment_method as Stripe.PaymentMethod
	// 	);
};

const relevantEvents = new Set([
	// 'product.created',
	// 'product.updated',
	// 'price.created',
	// 'price.updated',
	// 'checkout.session.completed',
	'customer.subscription.created',
	'customer.subscription.updated',
	'customer.subscription.deleted'
]);

export async function POST(req: Request) {
	const body = await req.text();
	const sig = headers().get('Stripe-Signature') as string;
	const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET_LIVE ?? process.env.STRIPE_WEBHOOK_SECRET;
	let event: Stripe.Event;

	try {
		if (!sig || !webhookSecret) return;
		event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
	} catch (err: any) {
		console.log(`❌ Error message: ${err.message}`);
		return new Response(`Webhook Error: ${err.message}`, { status: 400 });
	}

	if (relevantEvents.has(event.type)) {
		try {
			switch (event.type) {
				case 'customer.subscription.created':
				case 'customer.subscription.updated':
				case 'customer.subscription.deleted': {
					const subscription = event.data.object as Stripe.Subscription;
					await manageSubscriptionStatusChange(
						subscription.id,
						subscription.customer as string,
						event.type === 'customer.subscription.created'
					);
					break;
				}
				case 'checkout.session.completed': {
					const checkoutSession = event.data.object as Stripe.Checkout.Session;
					if (checkoutSession.mode === 'subscription') {
						const subscriptionId = checkoutSession.subscription;
						await manageSubscriptionStatusChange(
							subscriptionId as string,
							checkoutSession.customer as string,
							true
						);
					}
					break;
				}
				default:
					throw new Error('Unhandled relevant event!');
			}
		} catch (error) {
			console.log(error);
			return new Response('Webhook handler failed. View logs.', {
				status: 400
			});
		}
	}
	return new Response(JSON.stringify({ received: true }));
}
