<script lang="ts">
	import { Loader2, Send } from 'lucide-svelte';
	import { createEventDispatcher } from 'svelte';

	export let isLoading; // If the current message is generating a response
	let message = '';

	const dispatch = createEventDispatcher();

	const dispatchMessage = () => {
		dispatch('message', {
			data: message,
			type: 'text'
		});
		message = '';
	};
</script>

<form
	on:submit|preventDefault={dispatchMessage}
	class="flex items-center justify-center gap-5 border-none outline-none rounded-xl border bg-gray-100 resize-none scroll-p-3 p-3 sm:w-[320px]"
>
	<input
		class="scrollbar-custom overflow-x-hidden overflow-y-scroll bg-gray-100 outline-none w-full"
		width={400}
		bind:value={message}
		disabled={$isLoading}
		placeholder="Type a message"
		tabindex="0"
	/>
	<!-- rows="1" -->
	{#if $isLoading}
		<button class="stroke-slate-500 hover:cursor-pointer" on:click|preventDefault={dispatchMessage}>
			<Loader2 class="stroke-slate-500 animate-spin" size={17} />
		</button>
	{:else}
		<button class="stroke-slate-500 hover:cursor-pointer" on:click|preventDefault={dispatchMessage}>
			<Send class="stroke-slate-500" size={17} />
		</button>
	{/if}
</form>
<!-- TODO : Send icon in right -->
