<script lang="ts">
	import ConnectionModal from '$lib/components/ConnectionModal.svelte';
	import Sidebar from '$lib/components/Sidebar.svelte';
	import DatabasePanel from '$lib/components/DatabasePanel.svelte';
	import TablesPanel from '$lib/components/TablesPanel.svelte';
	import TabBar from '$lib/components/TabBar.svelte';
	import DataGrid from '$lib/components/DataGrid.svelte';
	import { getDatabases, getTables } from '$lib/backends/database';
	import type { Connection, Database, Table } from '$lib/types';
	import {
		connections,
		databases,
		tables,
		selectedConnection,
		selectedDatabase,
		openTabs,
		activeTabId,
		activeTab,
		isConnected,
		showConnectionModal,
		isDatabasesLoading,
		isTablesLoading,
		addConnection,
		selectConnection,
		selectDatabase,
		removeConnection,
		addTab,
		closeTab,
		setActiveTab,
		closeAllTabs,
		loadTabData,
		refreshTabData,
		changeTabPage,
		changeTabPageSize
	} from '$lib/stores/app';

	function onConnected(
		event: CustomEvent<{ dbName: string; driver: string; selectedDatabase?: string }>
	) {
		const { dbName, driver, selectedDatabase } = event.detail;
		console.log('Connected to the database successfully!', { dbName, driver, selectedDatabase });

		const newConnection: Connection = {
			name: dbName,
			driver: driver,
			isActive: true
		};

		addConnection(newConnection);
		loadDatabases(selectedDatabase);
	}

	function onAddConnection() {
		showConnectionModal.set(true);
	}

	function onSelectConnection(event: CustomEvent<Connection>) {
		const connection = event.detail;
		selectConnection(connection);
		loadDatabases();
	}

	function onRemoveConnection(event: CustomEvent<{ connectionName: string }>) {
		const { connectionName } = event.detail;
		removeConnection(connectionName);
	}

	function onSelectDatabase(event: CustomEvent<Database>) {
		const database = event.detail;
		selectDatabase(database);
		loadTables();
	}

	function onSelectTable(event: CustomEvent<Table>) {
		const table = event.detail;

		// Update selected table in store
		tables.update((tbls) =>
			tbls.map((tbl) => ({
				...tbl,
				isSelected: tbl.name === table.name
			}))
		);

		console.log('Selected table:', table);
	}

	function onViewTable(event: CustomEvent<Table>) {
		const table = event.detail;
		const currentConnection = $selectedConnection;
		const currentDatabase = $selectedDatabase;

		if (!currentConnection || !currentDatabase) {
			console.error('No connection or database selected');
			return;
		}

		// Create new tab
		const newTab = {
			connectionName: currentConnection.name,
			databaseName: currentDatabase.name,
			tableName: table.name,
			tableType: table.type,
			isLoading: true
		};

		addTab(newTab);

		// Load data for the new tab
		setTimeout(() => {
			const tabs = $openTabs;
			const latestTab = tabs[tabs.length - 1];
			if (latestTab) {
				loadTabData(latestTab.id);
			}
		}, 100);
	}

	async function loadDatabases(autoSelectDatabase?: string) {
		const currentConnection = $selectedConnection;
		if (!currentConnection) return;

		isDatabasesLoading.set(true);

		try {
			const result = await getDatabases(currentConnection.name);
			if (result.success && result.data) {
				const dbList = result.data.map((name) => ({
					name,
					isSelected: autoSelectDatabase ? name === autoSelectDatabase : false
				}));
				databases.set(dbList);

				// If auto-select database is specified and exists, select it
				if (autoSelectDatabase && result.data.includes(autoSelectDatabase)) {
					const selectedDb = { name: autoSelectDatabase, isSelected: true };
					selectedDatabase.set(selectedDb);
					loadTables();
				}
			} else {
				console.error(
					'Failed to load databases:',
					!result.success ? result.error : 'Unknown error'
				);
				databases.set([]);
			}
		} catch (error) {
			console.error('Error loading databases:', error);
			databases.set([]);
		} finally {
			isDatabasesLoading.set(false);
		}
	}

	async function loadTables() {
		const currentConnection = $selectedConnection;
		const currentDatabase = $selectedDatabase;
		if (!currentConnection || !currentDatabase) return;

		isTablesLoading.set(true);

		try {
			const result = await getTables(currentConnection.name, currentDatabase.name);
			if (result.success && result.data) {
				tables.set(
					result.data.map((table) => ({
						name: table.name,
						type: table.type,
						rowCount: table.rowCount,
						isSelected: false
					}))
				);
			} else {
				console.error('Failed to load tables:', !result.success ? result.error : 'Unknown error');
				tables.set([]);
			}
		} catch (error) {
			console.error('Error loading tables:', error);
			tables.set([]);
		} finally {
			isTablesLoading.set(false);
		}
	}

	function refreshDatabases() {
		loadDatabases();
	}

	function refreshTables() {
		loadTables();
	}

	// Tab event handlers
	function onSelectTab(event: CustomEvent<string>) {
		const tabId = event.detail;
		setActiveTab(tabId);
	}

	function onCloseTab(event: CustomEvent<string>) {
		const tabId = event.detail;
		closeTab(tabId);
	}

	function onCloseAllTabs() {
		closeAllTabs();
	}

	// DataGrid event handlers
	function onPageChange(event: CustomEvent<number>) {
		const page = event.detail;
		const currentTab = $activeTab;
		if (currentTab) {
			changeTabPage(currentTab.id, page);
		}
	}

	function onPageSizeChange(event: CustomEvent<number>) {
		const pageSize = event.detail;
		const currentTab = $activeTab;
		if (currentTab) {
			changeTabPageSize(currentTab.id, pageSize);
		}
	}

	function onRefreshData() {
		const currentTab = $activeTab;
		if (currentTab) {
			refreshTabData(currentTab.id);
		}
	}

	function onExportData() {
		// TODO: Implement data export
		console.log('Export data functionality not implemented yet');
	}
</script>

{#if !$isConnected}
	<div class="flex min-h-screen items-center justify-center bg-gray-800">
		<h1 class="text-4xl text-white">Sora DB</h1>
		<ConnectionModal bind:show={$showConnectionModal} on:connected={onConnected} />
	</div>
{:else}
	<div class="flex h-screen bg-gray-900">
		<!-- Sidebar -->
		<Sidebar
			connections={$connections}
			on:add-connection={onAddConnection}
			on:select-connection={onSelectConnection}
			on:remove-connection={onRemoveConnection}
		/>

		<!-- Database Panel -->
		<DatabasePanel
			databases={$databases}
			connectionName={$selectedConnection?.name || ''}
			isLoading={$isDatabasesLoading}
			on:select-database={onSelectDatabase}
			on:refresh-databases={refreshDatabases}
		/>

		<!-- Tables Panel -->
		<TablesPanel
			tables={$tables}
			databaseName={$selectedDatabase?.name || ''}
			isLoading={$isTablesLoading}
			on:select-table={onSelectTable}
			on:view-table={onViewTable}
			on:refresh-tables={refreshTables}
		/>

		<!-- Tab and Content Area -->
		<div class="flex min-w-0 flex-1 flex-col">
			<!-- Tab Bar -->
			<div class="flex-shrink-0">
				<TabBar
					tabs={$openTabs}
					activeTabId={$activeTabId}
					on:select-tab={onSelectTab}
					on:close-tab={onCloseTab}
					on:close-all-tabs={onCloseAllTabs}
				/>
			</div>

			<!-- Tab Content -->
			<div class="min-h-0 flex-1">
				{#if $activeTab}
					<DataGrid
						data={$activeTab.data}
						isLoading={$activeTab.isLoading}
						error={$activeTab.error}
						tableName={$activeTab.tableName}
						databaseName={$activeTab.databaseName}
						connectionName={$activeTab.connectionName}
						on:page-change={onPageChange}
						on:page-size-change={onPageSizeChange}
						on:refresh={onRefreshData}
						on:export={onExportData}
					/>
				{:else}
					<!-- Empty state when no tabs are open -->
					<div class="flex h-full items-center justify-center bg-gray-800">
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
							<h3 class="mt-4 text-lg font-medium text-gray-400">No Tables Open</h3>
							<p class="mt-2 text-sm text-gray-500">
								Select a table from the left panel and click "View" to open it in a new tab
							</p>
						</div>
					</div>
				{/if}
			</div>
		</div>

		<!-- Connection Modal for adding new connections -->
		<ConnectionModal bind:show={$showConnectionModal} on:connected={onConnected} />
	</div>
{/if}
