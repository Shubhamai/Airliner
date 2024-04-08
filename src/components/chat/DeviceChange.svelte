<script lang="ts">
	import { info } from 'tauri-plugin-log-api';
	import { onMount } from 'svelte';
	import { SettingsState } from '../../state';
	import { InputMode } from '../../enums/inputMode';
	import Recorder from './AudioRecorder.svelte';
	import { BoomBox, Keyboard, Mic, MoreVertical, Volume2 } from 'lucide-svelte';
	import RecordTrigger from './recordTrigger.svelte';

	let inputDevices: MediaDeviceInfo[] = [];
	let outputDevices: MediaDeviceInfo[] = [];

	// const updateSelectedDevice = (selectedDevice: string, type: InputMode) => {
	// 	switch (type) {
	// 		case InputMode.INPUT: {
	// 			break;
	// 		}
	// 		case InputMode.OUTPUT: {
	// 			$SettingsState = { ...$SettingsState, outputDevice: selectedDevice };
	// 			break;
	// 		}
	// 	}
	// };

	const requestPermissionAndUpdateDevices = async () => {
		// Disable right click, TODO : Need in better place
		document.addEventListener('contextmenu', (e) => e.preventDefault());

		try {
			const constraints = { audio: true };
			await navigator.mediaDevices.getUserMedia(constraints);
			navigator.mediaDevices.addEventListener('devicechange', (selectedDevice) => {
				updateDevicesList();
			});
			await updateDevicesList();
		} catch (err) {
			console.error('Error getting permission:', err);
		}
	};

	const updateDevicesList = async () => {
		try {
			const allDevices = await navigator.mediaDevices.enumerateDevices();

			inputDevices = allDevices.filter((device) => device.kind === 'audioinput');
			outputDevices = allDevices.filter((device) => device.kind === 'audiooutput');

			let selectedInputDevice =
				inputDevices.find((device) => device.deviceId === 'default')?.deviceId ||
				inputDevices[0].deviceId;
			let selectedOutputDevice =
				outputDevices.find((device) => device.deviceId === 'default')?.deviceId ||
				outputDevices[0].deviceId;

			$SettingsState = {
				...$SettingsState,
				inputDevice: selectedInputDevice,
				outputDevice: selectedOutputDevice
			};
		} catch (error) {
			console.error('Error fetching media devices:', error);
		}
	};

	onMount(requestPermissionAndUpdateDevices);
</script>

<div class="group flex flex-col items-center justify-center" title="Device & Shortcut Settings">
	<div
		class="absolute mb-44 mr-10 hidden group-focus-within:flex flex-col items-start justify-center group-focus-within:border-2 group-focus-within:border-slate-200 rounded-lg bg-white"
	>
		<div class="flex flex-row gap-1 items-center px-2">
			<Mic class="stroke-slate-500" size={17} />
			<select
				title="Input Device"
				class="hidden group-focus-within:flex appearance-none py-1 px-2 rounded-lg outline-none text-sm"
				bind:value={$SettingsState.inputDevice}
				on:change={(e) => {
					$SettingsState = { ...$SettingsState, inputDevice: e.target.value };
				}}
			>
				<!-- <option selected disabled>Input Device</option> -->

				{#each inputDevices as device}
					<option title={device.label} class="text-sm" value={device.deviceId}
						>{device.label.slice(0, 20)}...</option
					>
				{/each}
			</select>
		</div>

		<div class="flex flex-row gap-1 items-center px-2">
			<Volume2 class="stroke-slate-500" size={17} />
			<select
				title="Output Device"
				class="hidden group-focus-within:flex appearance-none py-1 px-2 rounded-lg outline-none text-sm"
				bind:value={$SettingsState.outputDevice}
				on:change={(e) => {
					$SettingsState = { ...$SettingsState, outputDevice: e.target.value };
				}}
			>
				{#each outputDevices as device}
					<option title={device.label} class="text-sm" value={device.deviceId}
						>{device.label.slice(0, 20)}...</option
					>
				{/each}
			</select>
		</div>
		<div class="flex flex-row gap-1 items-center px-2" title="Keyboard Shortcut for recording">
			<Keyboard class="stroke-slate-500" size={17} />
			<RecordTrigger />
		</div>
		<div class="flex flex-row gap-1 items-center px-2" title="Text to Speech Settings">
			<BoomBox class="stroke-slate-500" size={17} />

			<button
				class="py-1 px-2 text-sm"
				on:click={() => {
					$SettingsState = {
						...$SettingsState,
						enableSpeech: !$SettingsState.enableSpeech
					};
				}}
			>
				{#if $SettingsState.enableSpeech}
					<span class="text-sm">Disable Speech</span>
				{:else}
					<span class="text-sm">Enable Speech</span>
				{/if}
			</button>
		</div>
	</div>

	<button><MoreVertical class="stroke-gray-500 border rounded-full p-2" size={42} /> </button>
</div>
