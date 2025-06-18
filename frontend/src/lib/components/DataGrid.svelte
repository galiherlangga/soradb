<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import type { TableData, TableColumn, TableRow } from '$lib/types';
	import { formatRowCount } from '$lib/utils';

	const dispatch = createEventDispatcher();

	export let data: TableData | null = null;
	export let isLoading: boolean = false;
	export let error: string | null = null;
	export let tableName: string = '';
	export let databaseName: string = '';
	export let connectionName: string = '';

	function handlePageChange(newPage: number) {
		dispatch('page-change', newPage);
	}

	function handlePageSizeChange(newPageSize: number) {
		dispatch('page-size-change', newPageSize);
	}

	function refreshData() {
		dispatch('refresh');
	}

	function exportData() {
		dispatch('export');
	}

	// Calculate pagination info
	$: totalPages = data ? Math.ceil(data.totalRows / data.pageSize) : 0;
	$: startRow = data ? (data.currentPage - 1) * data.pageSize + 1 : 0;
	$: endRow = data ? Math.min(data.currentPage * data.pageSize, data.totalRows) : 0;

	// Handle cell value display
	function formatCellValue(value: any): string {
		if (value === null) return 'NULL';
		if (value === undefined) return '';
		if (typeof value === 'boolean') return value ? 'true' : 'false';
		if (typeof value === 'object') return JSON.stringify(value);
		return String(value);
	}

	function getCellClass(value: any): string {
		if (value === null) return 'text-orange-400 italic';
		if (typeof value === 'boolean') return 'text-blue-400';
		if (typeof value === 'number') return 'text-green-400';
		if (typeof value === 'string' && value.length === 0) return 'text-gray-500 italic';
		return 'text-gray-200';
	}
</script>

<div class="flex h-full flex-col bg-gray-800">
	<!-- Header -->
	<div class="flex flex-shrink-0 items-center justify-between border-b border-gray-700/50 p-4">
		<div>
			<h3 class="text-lg font-semibold text-white">{tableName}</h3>
			<p class="text-sm text-gray-400">{databaseName} • {connectionName}</p>
		</div>

		<div class="flex items-center gap-2">
			<!-- Page Size Selector -->
			<select
				class="rounded-lg border-0 bg-gray-700/50 px-3 py-2 text-sm text-white focus:bg-gray-700 focus:ring-2 focus:ring-green-500/40 focus:outline-none"
				value={data?.pageSize || 50}
				on:change={(e) => {
					const target = e.target as HTMLSelectElement;
					handlePageSizeChange(parseInt(target.value));
				}}
				disabled={isLoading}
			>
				<option value={25}>25 rows</option>
				<option value={50}>50 rows</option>
				<option value={100}>100 rows</option>
				<option value={250}>250 rows</option>
				<option value={500}>500 rows</option>
			</select>

			<!-- Refresh Button -->
			<button
				class="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-700/50 text-gray-400 transition-all duration-200 hover:bg-gray-600/50 hover:text-green-400"
				on:click={refreshData}
				disabled={isLoading}
				title="Refresh data"
				aria-label="Refresh data"
			>
				<svg
					class="h-4 w-4 {isLoading ? 'animate-spin' : ''}"
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

			<!-- Export Button -->
			<button
				class="flex h-9 items-center gap-2 rounded-lg bg-green-600/20 px-3 py-2 text-sm font-medium text-green-400 transition-all duration-200 hover:bg-green-600/30 hover:text-green-300"
				on:click={exportData}
				disabled={isLoading || !data}
				title="Export data"
			>
				<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
					/>
				</svg>
				Export
			</button>
		</div>
	</div>

	<!-- Content Area -->
	<div class="min-h-0 flex-1 overflow-hidden">
		{#if isLoading}
			<div class="flex h-full items-center justify-center">
				<div class="text-center">
					<div
						class="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-gray-600 border-t-green-500"
					></div>
					<p class="mt-4 text-sm text-gray-400">Loading table data...</p>
				</div>
			</div>
		{:else if error}
			<div class="flex h-full items-center justify-center">
				<div class="text-center">
					<svg
						class="mx-auto h-12 w-12 text-red-400"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
						/>
					</svg>
					<h4 class="mt-4 text-lg font-medium text-red-400">Error Loading Data</h4>
					<p class="mt-2 text-sm text-gray-400">{error}</p>
					<button
						class="mt-4 rounded-lg bg-red-600/20 px-4 py-2 text-sm font-medium text-red-400 transition-colors hover:bg-red-600/30"
						on:click={refreshData}
					>
						Try Again
					</button>
				</div>
			</div>
		{:else if !data || data.rows.length === 0}
			<div class="flex h-full items-center justify-center">
				<div class="text-center">
					<svg
						class="mx-auto h-16 w-16 text-gray-600"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
						/>
					</svg>
					<h4 class="mt-4 text-lg font-medium text-gray-400">No Data Found</h4>
					<p class="mt-2 text-sm text-gray-500">This table appears to be empty</p>
				</div>
			</div>
		{:else}
			<!-- Data Table -->
			<div class="h-full overflow-auto">
				<table class="w-full border-collapse">
					<!-- Table Header -->
					<thead class="sticky top-0 border-b border-gray-700/50 bg-gray-900">
						<tr>
							{#each data.columns as column}
								<th
									class="border-r border-gray-700/30 px-4 py-3 text-left text-xs font-medium tracking-wider text-gray-400 uppercase last:border-r-0"
								>
									<div class="flex items-center gap-2">
										<span class="truncate">{column.name}</span>
										{#if column.primaryKey}
											<div class="h-2 w-2 rounded-full bg-yellow-500" title="Primary Key"></div>
										{/if}
										{#if column.autoIncrement}
											<div class="text-xs text-blue-400" title="Auto Increment">AI</div>
										{/if}
									</div>
									<div class="mt-1 text-xs font-normal text-gray-500">
										{column.type}{column.nullable ? '' : ' NOT NULL'}
									</div>
								</th>
							{/each}
						</tr>
					</thead>

					<!-- Table Body -->
					<tbody class="divide-y divide-gray-700/30">
						{#each data.rows as row, rowIndex}
							<tr class="transition-colors duration-150 hover:bg-gray-700/20">
								{#each data.columns as column}
									<td class="border-r border-gray-700/20 px-4 py-3 text-sm last:border-r-0">
										<div
											class="max-w-xs truncate {getCellClass(row[column.name])}"
											title={formatCellValue(row[column.name])}
										>
											{formatCellValue(row[column.name])}
										</div>
									</td>
								{/each}
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		{/if}
	</div>

	<!-- Footer with Pagination -->
	{#if data && data.rows.length > 0}
		<div class="flex flex-shrink-0 items-center justify-between border-t border-gray-700/50 p-4">
			<!-- Row Info -->
			<div class="text-sm text-gray-400">
				Showing {formatRowCount(startRow)} to {formatRowCount(endRow)} of {formatRowCount(
					data.totalRows
				)} rows
			</div>

			<!-- Pagination Controls -->
			<div class="flex items-center gap-2">
				<!-- First Page -->
				<button
					class="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-gray-700/50 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
					on:click={() => handlePageChange(1)}
					disabled={data.currentPage === 1}
					title="First page"
					aria-label="First page"
				>
					<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
						/>
					</svg>
				</button>

				<!-- Previous Page -->
				<button
					class="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-gray-700/50 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
					on:click={() => handlePageChange(data.currentPage - 1)}
					disabled={data.currentPage === 1}
					title="Previous page"
					aria-label="Previous page"
				>
					<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M15 19l-7-7 7-7"
						/>
					</svg>
				</button>

				<!-- Page Numbers -->
				<div class="flex items-center gap-1">
					{#each Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
						const pageOffset = Math.max(0, Math.min(totalPages - 5, data.currentPage - 3));
						return pageOffset + i + 1;
					}) as pageNum}
						<button
							class="flex h-8 w-8 items-center justify-center rounded-lg text-sm font-medium transition-colors {pageNum ===
							data.currentPage
								? 'bg-green-600 text-white'
								: 'text-gray-400 hover:bg-gray-700/50 hover:text-white'}"
							on:click={() => handlePageChange(pageNum)}
						>
							{pageNum}
						</button>
					{/each}
				</div>

				<!-- Next Page -->
				<button
					class="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-gray-700/50 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
					on:click={() => handlePageChange(data.currentPage + 1)}
					disabled={data.currentPage === totalPages}
					title="Next page"
					aria-label="Next page"
				>
					<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M9 5l7 7-7 7"
						/>
					</svg>
				</button>

				<!-- Last Page -->
				<button
					class="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-gray-700/50 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
					on:click={() => handlePageChange(totalPages)}
					disabled={data.currentPage === totalPages}
					title="Last page"
					aria-label="Last page"
				>
					<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M13 5l7 7-7 7M5 5l7 7-7 7"
						/>
					</svg>
				</button>
			</div>
		</div>
	{/if}
</div>
