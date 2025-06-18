<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	export let databases: Array<{ name: string; isSelected: boolean }> = [];
	export let connectionName: string = '';
	export let isLoading: boolean = false;

	function selectDatabase(database: { name: string; isSelected: boolean }) {
		dispatch('select-database', database);
	}

	function refreshDatabases() {
		dispatch('refresh-databases');
	}
</script>

<div class="flex h-full w-64 flex-col border-r border-gray-700/50 bg-gray-800">
	<!-- Header -->
	<div class="flex flex-shrink-0 items-center justify-between border-b border-gray-700/50 p-4">
		<div>
			<h3 class="text-sm font-semibold text-white">Databases</h3>
			<p class="truncate text-xs text-gray-400">{connectionName}</p>
		</div>
		<button
			class="group flex h-8 w-8 items-center justify-center rounded-lg bg-gray-700/50 transition-all duration-200 hover:bg-gray-600/50 hover:text-green-400"
			on:click={refreshDatabases}
			title="Refresh databases"
			disabled={isLoading}
			aria-label="Refresh databases"
		>
			<svg
				class="h-4 w-4 text-gray-400 transition-all duration-200 group-hover:text-green-400 {isLoading
					? 'animate-spin'
					: ''}"
				fill="none"
				stroke="currentColor"
				viewBox="0 0 24 24"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
				/>
			</svg>
		</button>
	</div>

	<!-- Database List -->
	<div class="min-h-0 flex-1 overflow-y-auto p-2">
		{#if isLoading}
			<div class="flex items-center justify-center py-8">
				<div class="text-center">
					<div
						class="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-gray-600 border-t-green-500"
					></div>
					<p class="mt-2 text-xs text-gray-400">Loading databases...</p>
				</div>
			</div>
		{:else if databases.length === 0}
			<div class="flex items-center justify-center py-8">
				<div class="text-center">
					<svg
						class="mx-auto h-12 w-12 text-gray-600"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-2.172a1 1 0 01-.707-.293L9.586 13.293A1 1 0 008.879 13H6.414a1 1 0 00-.707.293L3.293 15.707A1 1 0 003 16.414V18a2 2 0 002 2h14a2 2 0 002-2v-1.586a1 1 0 00-.293-.707L18.293 15.707A1 1 0 0017.586 15H16"
						/>
					</svg>
					<p class="mt-2 text-sm text-gray-400">No databases found</p>
					<button
						class="mt-2 text-xs text-green-400 transition-colors duration-200 hover:text-green-300"
						on:click={refreshDatabases}
					>
						Try refreshing
					</button>
				</div>
			</div>
		{:else}
			<div class="space-y-1">
				{#each databases as database (database.name)}
					<button
						class="group flex w-full items-center rounded-lg p-3 text-left transition-all duration-200 {database.isSelected
							? 'border border-green-500/30 bg-gradient-to-r from-green-600/20 to-emerald-600/20 shadow-lg shadow-green-500/10'
							: 'border border-transparent hover:bg-gray-700/50'}"
						on:click={() => selectDatabase(database)}
					>
						<!-- Database Icon -->
						<div
							class="mr-3 flex h-8 w-8 items-center justify-center rounded-lg {database.isSelected
								? 'bg-green-500/20'
								: 'bg-gray-700/50 group-hover:bg-gray-600/50'}"
						>
							<svg
								class="h-4 w-4 {database.isSelected
									? 'text-green-400'
									: 'text-gray-400 group-hover:text-gray-300'}"
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
						</div>

						<!-- Database Name -->
						<div class="flex-1">
							<p
								class="text-sm font-medium {database.isSelected
									? 'text-green-400'
									: 'text-white group-hover:text-gray-200'}"
							>
								{database.name}
							</p>
						</div>

						<!-- Selected Indicator -->
						{#if database.isSelected}
							<div class="flex h-5 w-5 items-center justify-center rounded-full bg-green-500">
								<svg class="h-3 w-3 text-white" fill="currentColor" viewBox="0 0 20 20">
									<path
										fill-rule="evenodd"
										d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
										clip-rule="evenodd"
									/>
								</svg>
							</div>
						{/if}
					</button>
				{/each}
			</div>
		{/if}
	</div>

	<!-- Footer Info -->
	<div class="flex-shrink-0 border-t border-gray-700/50 p-3">
		<div class="flex items-center justify-between">
			<span class="text-xs text-gray-400">
				{databases.length} database{databases.length !== 1 ? 's' : ''}
			</span>
			<div class="flex items-center gap-1">
				<div class="h-2 w-2 animate-pulse rounded-full bg-green-500"></div>
				<span class="text-xs text-gray-400">Connected</span>
			</div>
		</div>
	</div>
</div>
