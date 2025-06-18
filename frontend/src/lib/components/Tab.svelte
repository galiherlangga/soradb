<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import type { Tab } from '$lib/types';
	import { sanitizeTabTitle } from '$lib/utils';

	const dispatch = createEventDispatcher();

	export let tab: Tab;
	export let isActive: boolean = false;

	function closeTab(event: Event) {
		event.stopPropagation();
		dispatch('close', tab.id);
	}

	function selectTab() {
		dispatch('select', tab.id);
	}

	$: tabTitle = sanitizeTabTitle(tab.connectionName, tab.databaseName, tab.tableName);
</script>

<div
	class="group relative flex w-48 max-w-48 cursor-pointer items-center gap-2 rounded-t-lg border-b-2 px-4 py-2 text-sm font-medium transition-all duration-200 {isActive
		? 'border-green-500 bg-gray-800 text-white'
		: 'border-transparent bg-gray-700/50 text-gray-400 hover:bg-gray-700 hover:text-gray-300'}"
	on:click={selectTab}
	on:keydown={(e) => e.key === 'Enter' && selectTab()}
	role="button"
	tabindex="0"
	title="{tab.tableName} ({tab.databaseName} - {tab.connectionName})"
>
	<!-- Table Type Icon -->
	<div class="flex h-4 w-4 items-center justify-center">
		<svg
			class="h-3.5 w-3.5 {isActive ? 'text-green-400' : 'text-gray-500 group-hover:text-gray-400'}"
			fill="none"
			stroke="currentColor"
			viewBox="0 0 24 24"
		>
			{#if tab.tableType === 'view'}
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
				/>
			{:else}
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z M3 7l9-4 9 4"
				/>
			{/if}
		</svg>
	</div>

	<!-- Tab Title -->
	<span class="min-w-0 flex-1 truncate">{tabTitle}</span>

	<!-- Loading Indicator -->
	{#if tab.isLoading}
		<div
			class="h-3 w-3 animate-spin rounded-full border border-gray-400 border-t-transparent"
		></div>
	{/if}

	<!-- Error Indicator -->
	{#if tab.error}
		<div class="h-3 w-3 rounded-full bg-red-500" title="Error loading table data"></div>
	{/if}

	<!-- Close Button -->
	<button
		class="ml-1 flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full opacity-0 transition-all duration-200 group-hover:opacity-100 hover:bg-red-500 hover:text-white {isActive
			? 'opacity-100'
			: ''}"
		on:click={closeTab}
		title="Close tab"
		aria-label="Close tab"
	>
		<svg class="h-2.5 w-2.5" fill="currentColor" viewBox="0 0 20 20">
			<path
				fill-rule="evenodd"
				d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
				clip-rule="evenodd"
			/>
		</svg>
	</button>

	<!-- Active Tab Indicator -->
	{#if isActive}
		<div class="absolute right-0 bottom-0 left-0 h-0.5 bg-green-500"></div>
	{/if}
</div>
