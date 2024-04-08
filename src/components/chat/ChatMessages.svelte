<script lang="ts">
	import type { Message } from 'ai/svelte/dist';
	import { Plane, TowerControl } from 'lucide-svelte';

	export let messages: SvelteStore<Message[]>;
</script>

<!-- {message.role}:  -->
<div class="py-10">
	<!-- {#if $messages.length > 1}
		<hr class="border-slate-200" />
	{:else}
		<div class="p-30">
			<div class="font-black text-slate-900 text-3xl text-center">Airliner</div>
		</div>
	{/if} -->
	{#each $messages as message}
		<!-- TODO : Could be issue incase there ae multiple system messages -->
		{#if message.role !== 'system'}
			<div class="flex gap-2 items-center ml-4">
				{#if message.role === 'user'}
					<Plane class=" stroke-slate-600/70" size={20} strokeWidth={1} />
				{:else}
					<TowerControl class="flex-shrink-0 stroke-slate-600/70" size={20} strokeWidth={1} />
				{/if}
				<div class="py-2 break-words px-3">{message.content}</div>
			</div>
			<hr class="my-2 border-slate-200" />
		{/if}
	{/each}
</div>
