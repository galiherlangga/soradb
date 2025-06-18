<script lang="ts">
	import ConnectionModal from '$lib/components/ConnectionModal.svelte';
	import Sidebar from '$lib/components/Sidebar.svelte';
	import DatabasePanel from '$lib/components/DatabasePanel.svelte';
	import TablesPanel from '$lib/components/TablesPanel.svelte';
	import { getDatabases, getTables } from '$lib/backends/database';

	let showModal = true;
	let isConnected = false;

	// State management
	let connections = [];
	let databases = [];
	let tables = [];
	let selectedConnection = null;
	let selectedDatabase = null;
	let selectedTable = null;
	let isDatabasesLoading = false;
	let isTablesLoading = false;

	function onConnected(event) {
		const { dbName, driver } = event.detail;
		console.log('Connected to the database successfully!', { dbName, driver });

		// Add new connection
		const newConnection = {
			name: dbName,
			driver: driver,
			isActive: true
		};

		// Deactivate other connections
		connections = connections.map((conn) => ({ ...conn, isActive: false }));
		connections.push(newConnection);

		selectedConnection = newConnection;
		isConnected = true;

		// Load databases for this connection
		loadDatabases();
	}

	function onAddConnection() {
		showModal = true;
	}

	function onSelectConnection(event) {
		const connection = event.detail;

		// Update active connection
		connections = connections.map((conn) => ({
			...conn,
			isActive: conn.name === connection.name
		}));

		selectedConnection = connection;
		selectedDatabase = null;
		selectedTable = null;
		databases = [];
		tables = [];

		// Load databases for selected connection
		loadDatabases();
	}

	function onSelectDatabase(event) {
		const database = event.detail;

		// Update selected database
		databases = databases.map((db) => ({
			...db,
			isSelected: db.name === database.name
		}));

		selectedDatabase = database;
		selectedTable = null;
		tables = [];

		// Load tables for selected database
		loadTables();
	}

	function onSelectTable(event) {
		const table = event.detail;

		// Update selected table
		tables = tables.map((tbl) => ({
			...tbl,
			isSelected: tbl.name === table.name
		}));

		selectedTable = table;
		console.log('Selected table:', table);
	}

	async function loadDatabases() {
		if (!selectedConnection) return;

		isDatabasesLoading = true;

		try {
			const result = await getDatabases(selectedConnection.name);
			if (result.success) {
				databases = result.databases.map((name) => ({ name, isSelected: false }));
			} else {
				console.error('Failed to load databases:', result.error);
				// Fallback to empty array
				databases = [];
			}
		} catch (error) {
			console.error('Error loading databases:', error);
			databases = [];
		} finally {
			isDatabasesLoading = false;
		}
	}

	async function loadTables() {
		if (!selectedConnection || !selectedDatabase) return;

		isTablesLoading = true;

		try {
			const result = await getTables(selectedConnection.name, selectedDatabase.name);
			if (result.success) {
				tables = result.tables.map((table) => ({
					name: table.name || table.TABLE_NAME || '',
					type:
						(table.type || table.TABLE_TYPE || 'table').toLowerCase() === 'view' ? 'view' : 'table',
					rowCount: table.rowCount || table.TABLE_ROWS || undefined,
					isSelected: false
				}));
			} else {
				console.error('Failed to load tables:', result.error);
				tables = [];
			}
		} catch (error) {
			console.error('Error loading tables:', error);
			tables = [];
		} finally {
			isTablesLoading = false;
		}
	}

	function refreshDatabases() {
		loadDatabases();
	}

	function refreshTables() {
		loadTables();
	}
</script>

{#if !isConnected}
	<div class="flex min-h-screen items-center justify-center bg-gray-800">
		<h1 class="text-4xl text-white">Sora DB</h1>
		<ConnectionModal bind:show={showModal} on:connected={onConnected} />
	</div>
{:else}
	<div class="flex h-screen bg-gray-900">
		<!-- Sidebar -->
		<Sidebar
			{connections}
			on:add-connection={onAddConnection}
			on:select-connection={onSelectConnection}
		/>

		<!-- Database Panel -->
		<DatabasePanel
			{databases}
			connectionName={selectedConnection?.name || ''}
			isLoading={isDatabasesLoading}
			on:select-database={onSelectDatabase}
			on:refresh-databases={refreshDatabases}
		/>

		<!-- Tables Panel -->
		<TablesPanel
			{tables}
			databaseName={selectedDatabase?.name || ''}
			isLoading={isTablesLoading}
			on:select-table={onSelectTable}
			on:refresh-tables={refreshTables}
		/>

		<!-- Connection Modal for adding new connections -->
		<ConnectionModal bind:show={showModal} on:connected={onConnected} />
	</div>
{/if}
