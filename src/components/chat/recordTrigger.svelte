<script lang="ts">
	import { listen } from '@tauri-apps/api/event';
	import { SettingsState } from '../../state';

	let onFocus = false;

	const recordTrigger = () => {
		$SettingsState = { ...$SettingsState, keyEvent: 'Listening...' };

		listen('key-pressed', (event: { payload: { message: string; key: string } }) => {
			const { message, key } = event.payload;
			if (onFocus === true) {
				$SettingsState = { ...$SettingsState, keyEvent: key };
			}
			onFocus = false;
		});
	};
</script>

<button
	class="py-1 px-2 text-sm"
	on:pointerdown={() => {
		onFocus = true;
		recordTrigger();
	}}>{$SettingsState.keyEvent}</button
>
