import type { User } from '@supabase/supabase-js';
import { derived, writable } from 'svelte/store';

// TODO: Seems too many save-load cycles, need to optimize

// Create a writable store for the record state
export const SettingsState = writable<
	{
		inputDevice: string;
		outputDevice: string;
		keyEvent: string;
		enableSpeech: boolean;
		version: string;
		simbriefUserId: string;
		user: User | null;
	}>
({
	inputDevice: 'default',
	outputDevice: 'default',
	keyEvent: 'BackQuote',
	enableSpeech: false,
	version: '1',
	simbriefUserId: '',
	user : null
});

export const recordInputDevice = derived(
	SettingsState,
	($settings_state) => $settings_state.inputDevice
);

///////////////////////////////////////////////  Save and Load State  ///////////////////////////////////////////////

// Load the state from localStorage and update the settings_state store
if (typeof window !== 'undefined') {
	const savedState = localStorage.getItem('AppSettings');

	if (savedState) {
		const parsedState = JSON.parse(savedState);

		// console.log('Loading state :' + parsedState);

		SettingsState.update((state) => {
			return {
				...state,
				inputDevice: parsedState.inputDevice,
				outputDevice: parsedState.outputDevice,
				keyEvent: parsedState.keyEvent,
				enableSpeech: parsedState.enableSpeech,
				version: parsedState.version,
				simbriefUserId: parsedState.simbriefUserId
			};
		});
	}
}

// Save the state to localStorage
SettingsState.subscribe(($settings_state) => {
	// console.log('Saving state: ' + $settings_state);
	const stateToSave = {
		inputDevice: $settings_state.inputDevice,
		outputDevice: $settings_state.outputDevice,
		keyEvent: $settings_state.keyEvent,
		enableSpeech: $settings_state.enableSpeech,
		version: $settings_state.version,
		simbriefUserId: $settings_state.simbriefUserId

		// Exclude audioBlob from saved state, as Blob objects cannot be stored in localStorage
	};

	if (typeof window !== 'undefined') {
		localStorage.setItem('AppSettings', JSON.stringify(stateToSave));
	}
});
