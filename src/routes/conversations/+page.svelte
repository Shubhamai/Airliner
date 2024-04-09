<script lang="ts">
	import IdToken from '../../components/chat/IDToken.svelte';
	import Conversation from './Conversation.svelte';
</script>

<IdToken let:idToken>
	<!-- let:conversationId -->

	{#if idToken}
		<!-- && conversationId -->
		<Conversation {idToken}/>
		<!-- {conversationId} -->
	{:else}
		<p class="text-slate-700">Conversation Loading...</p>
	{/if}
</IdToken>