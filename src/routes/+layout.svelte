<script>
	// import { FirebaseApp } from 'sveltefire';
	import '../app.css';
	import Sidebar from '../components/sidebar/Sidebar.svelte';
	// import { fireStore, firebaseAuth } from '../utils/supabase';
	import { SvelteToast } from '@zerodevx/svelte-toast';

	export let data;
</script>

<div class="flex max-w-full max-h-screen">
	<!-- <FirebaseApp auth={firebaseAuth} firestore={fireStore}> -->
	<SvelteToast />
	<Sidebar conversations={data.conversations} />
	<slot />
	<!-- </FirebaseApp> -->
</div>

<style>
	:root {
		--toastBackground: #f7f7f7;
		--toastColor: #353535;
		--toastBarHeight: 0;
	}
</style>
