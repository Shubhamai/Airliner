<script lang="ts">
	import { SendHorizontal, Trash2 } from 'lucide-svelte';
	import UserAuth from './userAuth.svelte';
	import { buttonVariants } from '../ui/button';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { SettingsState } from '../../state';
	import { getSimbriefData } from '../../utils/simbrief/simbriefParser';
	import type { Message } from 'ai/svelte/dist';
	import { toast } from '@zerodevx/svelte-toast';
	import { supabase } from '../../utils/supabase';

	export let conversations: any[] = [];

	const flightNames = [
		// Celestial Series
		'Solar Express',
		'Lunar Voyager',
		'Starlight Drift',
		'Comet Cruiser',
		'Nebula Navigator',

		// Mythical Creatures Series
		'Phoenix Flight',
		"Dragon's Descent",
		'Gryphon Glide',
		'Pegasus Passage',
		"Mermaid's Migration",

		// Nature & Elements Series
		'Thunderbolt Transit',
		'Ocean Odyssey',
		'Mountain Majesty',
		'Desert Dreamer',
		'Forest Flyer',

		// Explorer Series
		'Horizon Hunter',
		'Skyward Seeker',
		'Terra Tracker',
		'Cloud Chaser',
		'Polar Pioneer',

		// Adventurous Series
		'Aero Adventure',
		'Wind Wanderer',
		'Altitude Ace',
		'Twilight Trekker',
		'Dawn Dasher',

		// Elegance & Luxury Series
		'Royal Rendezvous',
		'Elite Escape',
		'Prestige Passage',
		'First Class Fantasy',
		'Luxe Lifter',

		// Dream Series
		"Dreamer's Drift",
		'Midnight Mirage',
		'Whispering Wish',
		'Reverie Riser',
		"Daydreamer's Delight",

		// Mystical Series
		'Enchanted Elevator',
		'Magic Motion',
		'Mysterious Move',
		'Fantasy Flight',
		'Ethereal Escape',

		// Time & Era Series
		'Vintage Voyager',
		'Future Flyer',
		'Retro Racer',
		'Millennium Mover',
		'Timeless Traveler',

		// Abstract Series
		'Serenity Skyline',
		'Imagination Ignition',
		'Harmony Heights',
		'Ethos Elevate',
		'Beyond Boundaries'
	];

	const getRandomFlightName = () => flightNames[Math.floor(Math.random() * flightNames.length)];

	const handleCreateNewFlight = async () => {
		// TODO : Add type via jsdoc
		let messages: Message[] = [];
		let title = '';

		const simbriefData = await getSimbriefData($SettingsState.simbriefUserId);
		if ($SettingsState.simbriefUserId && simbriefData) {
			messages = [
				{
					id: Math.random().toString(),
					role: 'system',
					content:
						'As an air traffic controller or copilot, your role is to respond to pilot inquiries using available information in a concise and brief manner. Respond phonetic alphabet as necessary, convert any number to its corresponding word' +
						'\n \nInformation : \n' +
						JSON.stringify(simbriefData)
				}
			];

			title = `${simbriefData.origin.icao}/${simbriefData.origin.runway} - ${simbriefData.destination.icao}/${simbriefData.destination.runway}`;
		}

		const {
			data: { user }
		} = await supabase.auth.getUser();

		if (user?.id) {
			const { data, error } = await supabase
				.from('conversations')
				.insert([{ name: getRandomFlightName(), messages, title, user_id: user.id }])
				.select();

			if (error) {
				console.log('error', error);
			} else {
				conversations = [...conversations, data[0]];
			}
		} else {
			toast.push('Please login to add flights');
		}
	};
</script>

<div
	class="flex-initial flex flex-col gap-2 items-center pt-4 pb-3 bg-gray-100 w-[140px] w-min-[140px] w-max-[140px] h-screen"
>
	<button
		on:click={handleCreateNewFlight}
		class="mx-1 bg-slate-800 text-slate-100 text-sm shadow flex items-center gap-2 px-4 py-[7px] rounded-lg"
		>New Flight <SendHorizontal size={15} class="stroke-slate-100" strokeWidth={2} /></button
	>
	<div
		class="px-2 flex flex-col gap-6 w-[140px] w-min-[140px] w-max-[140px] scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-200 scrollbar-track-rounded-md overflow-y-auto"
	>
		<div class="flex flex-col gap-3 items-start py-2">
			<!-- SignedIn let:user>
				<Collection ref={`conversations/${user.uid}/conversations`} let:data>
					{#if data.length > 0} -->
			{#each conversations as conversation (conversation.id)}
				{#if conversation.id === $page.url.searchParams.get('conversationId')}
					<div
						class="group flex justify-between items-center px-2 py-1 bg-gray-200 border border-transparent hover:border hover:border-slate-200 hover:shadow-sm rounded-md w-full"
					>
						<button
							class="text-sm overflow-hidden whitespace-nowrap overflow-ellipsis"
							title={conversation.name}
							on:click={async () => {
								await goto(`/conversations?conversationId=${conversation.id}`);
							}}
						>
							{conversation.name}
						</button>

						<a
							href={`/`}
							class="hidden group-hover:flex"
							on:click={async () => {
								const { data, error } = await supabase
									.from('conversations')
									.delete()
									.match({ id: conversation.id })
									.select();

								conversations = conversations.filter((conv) => conv.id !== conversation.id);
							}}><Trash2 class="stroke-slate-500" size={17} /></a
						>
					</div>
				{:else}
					<div
						class="group flex justify-between items-center px-2 py-1 border-[1px] border-slate-200 hover:border hover:border-1 hover:border-slate-300 hover:shadow-sm rounded-md w-full"
						title="Click to open conversation"
					>
						<button
							class="text-sm overflow-hidden whitespace-nowrap overflow-ellipsis"
							title={conversation.name}
							on:click={async () => {
								await goto(`/conversations?conversationId=${conversation.id}`);
							}}
						>
							{conversation.name}
						</button>
						<button
							class="hidden group-hover:flex"
							on:click={async () => {
								const { data, error } = await supabase
									.from('conversations')
									.delete()
									.match({ id: conversation.id })
									.select();

								conversations = conversations.filter((conv) => conv.id !== conversation.id);
							}}><Trash2 class="stroke-slate-500" size={17} /></button
						>
					</div>
				{/if}
			{/each}
			<!-- {:else}
						<SignedIn let:user>
							<p class="text-sm">Ready to fly? <br /> <br /> Create a new Flight</p>
						</SignedIn>

						<SignedOut><p class="text-sm">Please log in to add/remove flights</p></SignedOut>
					{/if}
					<p slot="loading">Loading...</p>
				</Collection>
			</SignedIn> -->
		</div>
	</div>
	<UserAuth />
</div>
