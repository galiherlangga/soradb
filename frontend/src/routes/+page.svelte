<script lang="ts">
	import ConnectionModal from "$lib/components/ConnectionModal.svelte";

	let showModal = true;

	function onConnected() {
		// TODO: Load tables, schemas, etc.
		console.log('Connected to the database successfully!');
	}
</script>

<div class="flex min-h-screen items-center justify-center bg-gray-800">
	<h1 class="text-4xl text-white">Sora DB</h1>
	<ConnectionModal bind:show={showModal} on:connected={onConnected} />
</div>
