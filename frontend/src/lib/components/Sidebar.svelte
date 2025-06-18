<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	export let connections: Array<{ name: string; driver: string; isActive: boolean }> = [];

	function addConnection() {
		dispatch('add-connection');
	}

	function selectConnection(connection: any) {
		dispatch('select-connection', connection);
	}
</script>

<div class="flex h-full w-16 flex-col bg-gray-900 border-r border-gray-700/50">
	<!-- Connections List -->
	<div class="flex-1 py-4">
		{#each connections as connection, index (connection.name)}
			<button
				class="group relative mb-3 flex h-12 w-12 mx-auto items-center justify-center rounded-xl transition-all duration-200 {connection.isActive
					? 'bg-gradient-to-br from-green-600 to-emerald-600 shadow-lg shadow-green-500/25'
					: 'bg-gray-800 hover:bg-gray-700'}"
				on:click={() => selectConnection(connection)}
				title={`${connection.driver} - ${connection.name}`}
			>
				<!-- Connection Icon -->
				<svg
					class="h-6 w-6 {connection.isActive ? 'text-white' : 'text-gray-400 group-hover:text-green-400'}"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4"
					/>
				</svg>

				<!-- Active indicator -->
				{#if connection.isActive}
					<div class="absolute -left-1 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r bg-green-400"></div>
				{/if}

				<!-- Connection type badge -->
				<div
					class="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full text-xs font-bold {connection.isActive
						? 'bg-white text-green-600'
						: 'bg-gray-700 text-gray-300'}"
				>
					{connection.driver.charAt(0).toUpperCase()}
				</div>
			</button>
		{/each}
	</div>

	<!-- Add Connection Button -->
	<div class="p-2">
		<button
			class="group flex h-12 w-12 items-center justify-center rounded-xl bg-gray-800/50 transition-all duration-200 hover:bg-gradient-to-br hover:from-green-600/20 hover:to-emerald-600/20 hover:border-green-500/50 border border-gray-700/50 hover:shadow-lg hover:shadow-green-500/10"
			on:click={addConnection}
			title="Add new connection"
		>
			<svg
				class="h-6 w-6 text-gray-400 transition-colors duration-200 group-hover:text-green-400"
				fill="none"
				stroke="currentColor"
				viewBox="0 0 24 24"
			>
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
			</svg>
		</button>
	</div>
</div>
