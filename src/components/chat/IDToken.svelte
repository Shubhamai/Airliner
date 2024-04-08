<script lang="ts">
	import { afterUpdate, onMount } from 'svelte';
	import { afterNavigate } from '$app/navigation';
	import { PUBLIC_ORIGIN } from '$env/static/public';
	import { SettingsState } from '../../state';
	import { supabase } from '../../utils/supabase';

	let idToken: string | undefined;
	let stripeCustomerId: string | undefined = 'not-defined';

	const loadData = async () => {
		idToken = (await supabase.auth.getSession()).data?.session?.access_token;
		// stripeCustomerId = $SettingsState.user?.user_metadata.stripeId;
	};

	afterUpdate(async () => {
		await loadData();
	});

	afterNavigate(async () => {
		await loadData();
	});
</script>

{#if idToken}
	<!-- //  && conversationId} -->
	<slot {idToken} />
	<!-- {conversationId} /> -->
{:else}
	<p class="p-10 text-slate-700">
		You currently don't have an airliner subscription. Checkout <a
			class="underline"
			target="_blank"
			href={`${PUBLIC_ORIGIN}/dashboard`}>airliner.app/dashboard</a
		> to subscribe.
	</p>
{/if}
