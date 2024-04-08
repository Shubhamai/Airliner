<script lang="ts">
	import { Disc3, Mic } from 'lucide-svelte';
	import { listen } from '@tauri-apps/api/event';
	import { createEventDispatcher, onDestroy, onMount } from 'svelte';
	import { recordInputDevice, SettingsState } from '../../state';
	import { Recorder, type RecorderType } from '../../utils/recorder';
	const dispatch = createEventDispatcher();

	let recorder: RecorderType;
	let isRecording = false;

	const initializeRecorder = async () => {
		const data = await Recorder($SettingsState.inputDevice, (audioBlob) => {
			dispatch('message', {
				data: audioBlob,
				type: 'audio'
			});
		});

		// If data exists, initialize the recorder, else throw an error
		data ? (recorder = data) : console.error('Error initializing recorder');
	};

	// Subscribe to input device state changes
	const unsubscribe = recordInputDevice.subscribe(async ($recordInputDevice) => {
		console.log('Input device has changed: ', $recordInputDevice);

		dispatch('message', {
			data: new Blob(),
			type: 'audio'
		});
		initializeRecorder();
	});

	// Cleanup subscription when the component is destroyed
	onDestroy(unsubscribe);

	onMount(async () => {
		if (navigator.mediaDevices) {
			console.log('getUserMedia supported.');

			initializeRecorder();
		} else {
			console.log('getUserMedia not supported on your browser!');
		}
	});

	// TODO : Fix the issue where recorder starts when the record trigger value is changed
	onMount(async () => {
		await listen('key-pressed', (event: { payload: { message: string; key: string } }) => {
			const { message, key } = event.payload;
			if (message === 'Pressed' && key === $SettingsState.keyEvent) {
				isRecording = true;
				recorder?.start();
			} else if (message === 'Released' && key === $SettingsState.keyEvent) {
				isRecording = false;
				recorder?.end();
			}
		});
	});
</script>

<!-- TODO : A record icon  -->
<button
	on:mousedown={() => {
		recorder?.start();
		isRecording = true;
	}}
	on:mouseup={() => {
		recorder?.end();
		isRecording = false;
	}}
>
	{#if isRecording}
		<Disc3 class="stroke-gray-500 border rounded-full p-2 animate-spin" size={42} />
	{:else}
		<Mic class="stroke-gray-500 border rounded-full p-2" size={42} />
	{/if}
</button>
