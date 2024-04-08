<script lang="ts">
	import { useChat, type Message } from 'ai/svelte';
	// import GetSimbrief from '../../components/getSimbrief.svelte';
	import Record from '../../components/chat/AudioRecorder.svelte';
	import ChatInput from '../../components/chat/ChatInput.svelte';
	import ChatMessages from '../../components/chat/ChatMessages.svelte';
	import Settings from '../../components/chat/DeviceChange.svelte';
	import { afterUpdate, beforeUpdate, onMount } from 'svelte';
	import axios from 'axios';
	import { SettingsState } from '../../state';
	import { toast } from '@zerodevx/svelte-toast';
	import { afterNavigate, beforeNavigate, goto, onNavigate } from '$app/navigation';
	import { PUBLIC_ORIGIN } from '$env/static/public';
	import { supabase } from '../../utils/supabase';
	import type { User } from '@supabase/supabase-js';

	export let idToken: string;
	export let stripeCustomerId: string;

	let title: string = '';

	beforeUpdate(async () => {
		// idToken = (await $user?.getIdToken()) || '';

		idToken = (await supabase.auth.getSession()).data?.session?.access_token || '';
	});
	afterNavigate(async () => {
		const url = new URL(window.location.href);
		const conversationId = url.searchParams.get('conversationId') || '';

		if ($SettingsState.user?.id) {
			let initialMessages = [];
			// const docRef = doc(fireStore, 'conversations', $user?.uid, 'conversations', conversationId);
			// const docSnap = await getDoc(docRef);

			const { data, error } = await supabase
				.from('conversations')
				.select('messages, title')
				.match({ id: conversationId })
				.single();

			if (data) {
				initialMessages = data.messages;
				title = data.title;
			} else {
				toast.push('Unable to load the conversation');
				await goto('/');
			}
			setMessages(initialMessages);
		}

		// idToken = (await $user?.getIdToken()) || '';
		idToken = (await supabase.auth.getSession()).data?.session?.access_token || '';
	});

	onMount(async () => {
		const url = new URL(window.location.href);
		const conversationId = url.searchParams.get('conversationId') || '';

		if ($SettingsState.user?.id) {
			let initialMessages = [];
			// const docRef = doc(fireStore, 'conversations', $user?.uid, 'conversations', conversationId);
			// const docSnap = await getDoc(docRef);

			const { data, error } = await supabase
				.from('conversations')
				.select('messages, title')
				.match({ id: conversationId })
				.single();

			if (data) {
				initialMessages = data.messages;
				title = data.title;
			} else {
				toast.push('Unable to load the conversation');
				await goto('/');
			}
			setMessages(initialMessages);
		}
	});

	const addChatInput = async (text: string) => {
		append({
			id: Math.random().toString(),
			role: 'user',
			content: text
		});
	};

	let { messages, append, isLoading, stop, reload, setMessages } = useChat({
		api: `${PUBLIC_ORIGIN}/api/answer`,

		headers: {
			Authorization: `${idToken}`,
			stripeCustomerId: `${stripeCustomerId}`
		},

		async onError(error) {
			toast.push(error.message);
		},

		onFinish: async (data: Message) => {
			const url = new URL(window.location.href);
			const conversationId = url.searchParams.get('conversationId') || '';

			if ($SettingsState.user?.id) {
				// updateDoc(doc(fireStore, 'conversations', $user?.uid, 'conversations', conversationId), {
				// 	messages: $messages
				// });

				const { data, error } = await supabase
					.from('conversations')
					.update({ messages: $messages })
					.match({ id: conversationId });
			}

			if ($SettingsState.enableSpeech) {
				await fetch(`${PUBLIC_ORIGIN}/api/speech`, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						Authorization: `${idToken}`,
						stripeCustomerId: `${stripeCustomerId}`
					},
					body: JSON.stringify({
						text: data.content,
						idToken: idToken
					})
				})
					.then(async (response) => {
						const audioData = await response.json();
						const audio = 'data:audio/x-wav;base64,' + audioData;
						new Audio(audio).play();
					})
					.catch(async (error) => {
						toast.push(error.message);
					});
			}
		}
	});

	const handleMessage = async (event: any) => {
		if (event.detail.type === 'audio') {
			const audioBlob = event.detail.data;

			if (audioBlob.size === 0) {
				return;
			}

			let apiLink = `${PUBLIC_ORIGIN}/api/transcript`;

			const newForm = new FormData();
			newForm.append('model', 'whisper-1');
			newForm.append('file', audioBlob, 'audio.webm');
			newForm.append('idToken', `${idToken}`);

			await axios
				.post(apiLink, newForm, {
					headers: {
						'Content-Type': 'multipart/form-data',
						Authorization: `${idToken}`,
						stripeCustomerId: `${stripeCustomerId}`
					}
				})
				.then(async (response) => {
					const transcript = response.data.data;
					await addChatInput(transcript);
				})
				.catch((error) => {
					toast.push(error.message);
				});
		} else if (event.detail.type === 'text') {
			await addChatInput(event.detail.data);
		} else {
			console.error('Invalid message type');
			// Throw error
		}
	};
</script>

<div class="flex-auto flex items-center flex-col">
	<div
		class="flex-auto pt-4 sm:px-6 md:px-14 lg:px-20 xl:px-20 2xl:px-20 w-full scroll-smooth overflow-y-auto scrollbar-thin scrollbar-track-slate-50 scrollbar-thumb-gray-400 scrollbar-track-rounded-md"
	>
		<!-- <GetSimbrief messages={$messages} {setMessages} /> -->
		<h6 class="justify-center text-center text-slate-600 font-normal italic">
			{title}
		</h6>
		<ChatMessages {messages} />
	</div>
	<div class="flex-initial flex gap-3 my-3">
		<Record on:message={handleMessage} />
		<ChatInput on:message={handleMessage} {isLoading} />
		<Settings />
	</div>
</div>
