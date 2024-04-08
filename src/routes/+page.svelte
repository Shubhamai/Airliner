<script lang="ts">
	import UserAuth from '../components/sidebar/userAuth.svelte';
	import { PUBLIC_APP_ASSETS, PUBLIC_APP_NAME, PUBLIC_ORIGIN } from '$env/static/public';
	import { base } from '$app/paths';
	import { page } from '$app/stores';
	// import ChatWindow from '../components/chat/ChatWindow.svelte';
	// import Sidebar from '../components/sidebar/Sidebar.svelte';
	import { SettingsState } from '../state';
	// import { SignedIn } from 'sveltefire';
</script>

<svelte:head>
	<title>{PUBLIC_APP_NAME}</title>
	<meta name="description" content="Virtual ATC for Microsoft Flight Simulator" />
	<meta name="twitter:card" content="summary_large_image" />
	<!-- <meta name="twitter:site" content="@huggingface" /> -->
	<meta property="og:title" content={PUBLIC_APP_NAME} />
	<meta property="og:type" content="website" />
	<meta property="og:url" content="{PUBLIC_ORIGIN || $page.url.origin}{base}" />
	<meta
		property="og:image"
		content="{PUBLIC_ORIGIN || $page.url.origin}{base}/{PUBLIC_APP_ASSETS}/thumbnail.png"
	/>
	<link
		rel="icon"
		href="{PUBLIC_ORIGIN || $page.url.origin}{base}/{PUBLIC_APP_ASSETS}/favicon.ico"
		type="image/svg+xml"
	/>
	<link
		rel="icon"
		href="{PUBLIC_ORIGIN || $page.url.origin}{base}/{PUBLIC_APP_ASSETS}/favicon.png"
		type="image/png"
	/>
	<!-- Icon Support for iOS Bookmark Home Screen -->
	<link
		rel="apple-touch-icon"
		href="{PUBLIC_ORIGIN || $page.url.origin}{base}/{PUBLIC_APP_ASSETS}/touch-icon-ipad-retina.png"
		sizes="167x167"
		type="image/png"
	/>
	<link
		rel="apple-touch-icon"
		href="{PUBLIC_ORIGIN || $page.url.origin}{base}/{PUBLIC_APP_ASSETS}/touch-icon-ipad.png"
		sizes="152x152"
		type="image/png"
	/>
	<link
		rel="apple-touch-icon"
		href="{PUBLIC_ORIGIN ||
			$page.url.origin}{base}/{PUBLIC_APP_ASSETS}/touch-icon-iphone-retina.png"
		sizes="180x180"
		type="image/png"
	/>
</svelte:head>

<!-- <ChatWindow /> -->
<div class="p-10 flex flex-col gap-12">
	<div class="flex flex-col gap-6">
		<div class="flex flex-row items-baseline gap-4">
			<h1 class="text-3xl font-bold">Airliner</h1>
			<h6 class="rounded-md bg-slate-200 px-2 text-sm font-normal shadow-sm">v0.0.1</h6>
		</div>

		<p class="text-sm text-slate-600">
			Interact effortlessly with your virtual ATC using voice, and inquire anything based on your
			SimBrief data with the combined power of OpenAI's ChatGPT and Speech-to-Text technologies.
		</p>

		<div>
			<p class="text-md font-semibold">Features :</p>
			<!-- Create a list of features -->
			<ul class="list-disc list-inside text-sm text-slate-600">
				<li>Communicate with your virtual ATC using either voice or text</li>
				<li>Use Backquote (`) to record your voice for conversation</li>
				<li>Enable/Disable text-to-speech</li>
				<li>Enter your SimBrief ID to get information about your flight</li>
			</ul>
		</div>
	</div>

	<!-- <SignedIn> -->
		<div class="flex flex-row items-center gap-3">
			<h6 class="text-sm">Simbrief ID &nbsp;:</h6>
			<input
				class="w-fit bg-transparent text-base focus:outline-none border border-slate-300 text-slate-600 font-italic"
				type="text"
				placeholder="Enter your Simbrief ID"
				bind:value={$SettingsState.simbriefUserId}
			/>
		</div>
	<!-- </SignedIn> -->

	<!-- <div class="flex flex-col gap-6">
		<h1 class="text-xl font-bold">Latest Updates</h1>
		<div>asd</div>
	</div> -->
</div>
