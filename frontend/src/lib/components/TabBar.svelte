<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import Tab from './Tab.svelte';
	import type { Tab as TabType } from '$lib/types';

	const dispatch = createEventDispatcher();

	export let tabs: TabType[] = [];
	export let activeTabId: string | null = null;

	function selectTab(event: CustomEvent<string>) {
		const tabId = event.detail;
		dispatch('select-tab', tabId);
	}

	function closeTab(event: CustomEvent<string>) {
		const tabId = event.detail;
		dispatch('close-tab', tabId);
	}

	// Scroll container for tabs when there are many
	let tabContainer: HTMLElement;

	function scrollToActiveTab() {
		if (tabContainer && activeTabId) {
			const activeTabElement = tabContainer.querySelector(`[data-tab-id="${activeTabId}"]`);
			if (activeTabElement) {
				activeTabElement.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
			}
		}
	}

	$: if (activeTabId) {
		setTimeout(scrollToActiveTab, 100);
	}
</script>

<div class="flex h-12 border-b border-gray-700/50 bg-gray-900">
	{#if tabs.length > 0}
		<div class="flex min-w-0 flex-1">
			<!-- Tab Navigation -->
			<div
				bind:this={tabContainer}
				class="scrollbar-hide flex min-w-0 flex-1 overflow-x-auto"
				style="scrollbar-width: none; -ms-overflow-style: none;"
			>
				{#each tabs as tab (tab.id)}
					<div data-tab-id={tab.id} class="flex-shrink-0">
						<Tab
							{tab}
							isActive={tab.id === activeTabId}
							on:select={selectTab}
							on:close={closeTab}
						/>
					</div>
				{/each}
			</div>

			<!-- Tab Actions -->
			<div class="flex flex-shrink-0 items-center border-l border-gray-700/50 px-2">
				<!-- Close All Tabs -->
				<button
					class="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition-colors duration-200 hover:bg-gray-700/50 hover:text-gray-300"
					on:click={() => dispatch('close-all-tabs')}
					title="Close all tabs"
					aria-label="Close all tabs"
				>
					<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M6 18L18 6M6 6l12 12"
						/>
					</svg>
				</button>

				<!-- Tab Count -->
				<div class="ml-2 rounded-full bg-gray-700/50 px-2 py-1 text-xs text-gray-400">
					{tabs.length}
				</div>
			</div>
		</div>
	{:else}
		<!-- Empty State -->
		<div class="flex flex-1 items-center justify-center">
			<div class="text-center">
				<svg
					class="mx-auto h-8 w-8 text-gray-600"
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
				<p class="mt-2 text-sm text-gray-500">No tables open</p>
				<p class="text-xs text-gray-600">Click "View" on a table to open it in a new tab</p>
			</div>
		</div>
	{/if}
</div>

<style>
	/* Hide scrollbar for Chrome, Safari and Opera */
	.scrollbar-hide::-webkit-scrollbar {
		display: none;
	}

	/* Hide scrollbar for IE, Edge and Firefox */
	.scrollbar-hide {
		-ms-overflow-style: none; /* IE and Edge */
		scrollbar-width: none; /* Firefox */
	}
</style>
