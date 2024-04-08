<script lang="ts">
	import { listen } from '@tauri-apps/api/event';
	import { ArrowUpRight, Settings } from 'lucide-svelte';
	import { goto } from '$app/navigation';
	import { PUBLIC_ORIGIN } from '$env/static/public';
	import { supabase } from '../../utils/supabase';
	import { onMount } from 'svelte';
	import { SettingsState } from '../../state';

	onMount(async () => {
		const { data, error } = await supabase.auth.signInAnonymously();

		const {
			data: { user: UserData }
		} = await supabase.auth.getUser();

		$SettingsState = {
			...$SettingsState,
			user: UserData
		};
	});

	const onLoginClick = async () => {
		listen('scheme-request-received', (event: { payload: string }) => {
			const url = event.payload;

			// Extract all valriables int object from ( for eg. ) airliner:?token={token}?abc=def
			const vars: {
				[key: string]: string;
			} = url
				.split('?')[1]
				.split('&')
				.reduce((acc, cur) => {
					const [key, value] = cur.split('=');
					return { ...acc, [key]: value };
				}, {});

			supabase.auth
				.verifyOtp({
					token_hash: vars['token'],
					type: 'email'
				})
				.then((userCredential) => {
					location.reload();
				})
				.catch((error) => {
					const errorCode = error.code;
					const errorMessage = error.message;
				});
		});
	};
</script>

{#if $SettingsState.user?.id}<div class="group flex flex-col items-center mt-auto">
		<div
			class="absolute bottom-[50px] w-[126px] hidden gap-1 group-focus-within:flex flex-col items-center justify-center bg-slate-100"
		>
			<a
				class="flex flex-row justify-between items-center pr-4 shadow-sm border border-slate-300 hover:shadow-md w-full rounded-md px-2 py-1"
				href="/"
			>
				Home
			</a>
			<a
				class="flex flex-row justify-between items-center pr-4 shadow-sm border border-slate-300 hover:shadow-md w-full rounded-md px-2 py-1"
				href={`${PUBLIC_ORIGIN}/dashboard`}
				target="_blank"
			>
				Dashboard
				<ArrowUpRight class="stroke-slate-500" size={18} />
			</a>

			<button
				class="flex flex-row justify-between items-center pr-4 shadow-sm border border-slate-300 hover:shadow-md w-full rounded-md px-2 py-1"
				on:click={async () => {
					supabase.auth.signOut();
					await goto('/');
				}}
			>
				Logout
			</button>
		</div>
		<button
			class="flex gap-4 justify-between items-center pr-4 shadow-sm border border-slate-300 hover:shadow-md w-full rounded-md px-2 py-1"
		>
			<!-- {$user?.displayName} -->
			Settings
			<Settings class="ml-3 stroke-slate-500" size={17} />
		</button>
	</div>{:else}
	<!-- // TODO : Change to airliner -->
	<a
		href={`${PUBLIC_ORIGIN}/dashboard?token=true`}
		target="_blank"
		class="flex justify-between items-center mt-auto shadow-sm border border-slate-300 hover:shadow-md w-[126px] rounded-md px-2 py-1"
		on:click={onLoginClick}>Login<ArrowUpRight class="stroke-slate-500" size={17} /></a
	>{/if}
