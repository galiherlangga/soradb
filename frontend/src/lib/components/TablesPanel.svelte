<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	export let tables: Array<{
		name: string;
		type: 'table' | 'view';
		rowCount?: number;
		isSelected: boolean;
	}> = [];
	export let databaseName: string = '';
	export let isLoading: boolean = false;

	function selectTable(table: any) {
		dispatch('select-table', table);
	}

	function refreshTables() {
		dispatch('refresh-tables');
	}

	function getTableIcon(type: string) {
		if (type === 'view') {
			return 'M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z';
		}
		return 'M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z M3 7l9-4 9 4';
	}

	function formatRowCount(count?: number) {
		if (!count) return '';
		if (count < 1000) return count.toString();
		if (count < 1000000) return `${(count / 1000).toFixed(1)}K`;
		return `${(count / 1000000).toFixed(1)}M`;
	}
</script>

<div class="flex h-full flex-1 flex-col bg-gray-800">
	<!-- Header -->
	<div class="flex items-center justify-between border-b border-gray-700/50 p-4">
		<div class="flex-1">
			<h3 class="text-sm font-semibold text-white">Tables</h3>
			<p class="text-xs text-gray-400 truncate">
				{databaseName ? `Database: ${databaseName}` : 'Select a database to view tables'}
			</p>
		</div>

		{#if databaseName}
			<div class="flex items-center gap-2">
				<!-- Search Input -->
				<div class="relative">
					<input
						type="text"
						placeholder="Search tables..."
						class="w-40 rounded-lg bg-gray-700/50 border-0 px-3 py-2 pl-8 text-sm text-white placeholder-gray-400 focus:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500/40 transition-all duration-200"
					>
					<svg
						class="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
					</svg>
				</div>

				<!-- Refresh Button -->
				<button
					class="group flex h-8 w-8 items-center justify-center rounded-lg bg-gray-700/50 transition-all duration-200 hover:bg-gray-600/50 hover:text-green-400"
					on:click={refreshTables}
					title="Refresh tables"
					disabled={isLoading}
				>
					<svg
						class="h-4 w-4 text-gray-400 transition-all duration-200 group-hover:text-green-400 {isLoading ? 'animate-spin' : ''}"
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
		{/if}
	</div>

	<!-- Tables List -->
	<div class="flex-1 overflow-y-auto p-4">
		{#if !databaseName}
			<div class="flex items-center justify-center py-16">
				<div class="text-center">
					<svg class="mx-auto h-16 w-16 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 9a2 2 0 00-2 2v2m0 0V9a2 2 0 012-2m0 0h14"
						/>
					</svg>
					<h4 class="mt-4 text-lg font-medium text-gray-400">Select a Database</h4>
					<p class="mt-2 text-sm text-gray-500">Choose a database from the left panel to view its tables</p>
				</div>
			</div>
		{:else if isLoading}
			<div class="flex items-center justify-center py-16">
				<div class="text-center">
					<div class="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-gray-600 border-t-green-500"></div>
					<p class="mt-4 text-sm text-gray-400">Loading tables...</p>
				</div>
			</div>
		{:else if tables.length === 0}
			<div class="flex items-center justify-center py-16">
				<div class="text-center">
					<svg class="mx-auto h-16 w-16 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
						/>
					</svg>
					<h4 class="mt-4 text-lg font-medium text-gray-400">No Tables Found</h4>
					<p class="mt-2 text-sm text-gray-500">This database appears to be empty</p>
					<button
						class="mt-4 text-sm text-green-400 hover:text-green-300 transition-colors duration-200"
						on:click={refreshTables}
					>
						Try refreshing
					</button>
				</div>
			</div>
		{:else}
			<div class="grid gap-3 grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3">
				{#each tables as table (table.name)}
					<button
						class="group flex items-center rounded-xl p-4 text-left transition-all duration-200 {table.isSelected
							? 'bg-gradient-to-r from-green-600/20 to-emerald-600/20 border border-green-500/30 shadow-lg shadow-green-500/10'
							: 'bg-gray-700/30 hover:bg-gray-700/50 border border-gray-600/30 hover:border-gray-500/50'}"
						on:click={() => selectTable(table)}
					>
						<!-- Table Icon -->
						<div class="mr-4 flex h-10 w-10 items-center justify-center rounded-lg {table.isSelected ? 'bg-green-500/20' : 'bg-gray-600/50 group-hover:bg-gray-600/70'}">
							<svg
								class="h-5 w-5 {table.isSelected ? 'text-green-400' : 'text-gray-400 group-hover:text-gray-300'}"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d={getTableIcon(table.type)}
								/>
							</svg>
						</div>

						<!-- Table Info -->
						<div class="flex-1 min-w-0">
							<div class="flex items-center gap-2">
								<p class="text-sm font-semibold truncate {table.isSelected ? 'text-green-400' : 'text-white group-hover:text-gray-200'}">
									{table.name}
								</p>
								<span class="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium {table.type === 'view'
									? 'bg-blue-500/20 text-blue-400'
									: 'bg-gray-500/20 text-gray-400'}">
									{table.type}
								</span>
							</div>

							{#if table.rowCount !== undefined}
								<p class="text-xs text-gray-400 mt-1">
									{formatRowCount(table.rowCount)} rows
								</p>
							{/if}
						</div>

						<!-- Selected Indicator -->
						{#if table.isSelected}
							<div class="flex h-6 w-6 items-center justify-center rounded-full bg-green-500">
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

	<!-- Footer Stats -->
	{#if databaseName && tables.length > 0}
		<div class="border-t border-gray-700/50 p-4">
			<div class="flex items-center justify-between text-xs text-gray-400">
				<div class="flex items-center gap-4">
					<span>{tables.length} table{tables.length !== 1 ? 's' : ''}</span>
					<span>{tables.filter(t => t.type === 'table').length} tables</span>
					<span>{tables.filter(t => t.type === 'view').length} views</span>
				</div>
				<div class="flex items-center gap-1">
					<div class="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
					<span>Active</span>
				</div>
			</div>
		</div>
	{/if}
</div>
