import { writable, get } from 'svelte/store';
import type { Connection, Database, Table, Tab } from '../types';
import { getTableData } from '../backends/database';

// Connection management
export const connections = writable<Connection[]>([]);
export const selectedConnection = writable<Connection | null>(null);

// Database and table browsing
export const databases = writable<Database[]>([]);
export const tables = writable<Table[]>([]);
export const selectedDatabase = writable<Database | null>(null);

// Tab management
export const openTabs = writable<Tab[]>([]);
export const activeTabId = writable<string | null>(null);

// UI state
export const isConnected = writable<boolean>(false);
export const showConnectionModal = writable<boolean>(true);
export const isDatabasesLoading = writable<boolean>(false);
export const isTablesLoading = writable<boolean>(false);

// Derived stores
import { derived } from 'svelte/store';

export const activeTab = derived([openTabs, activeTabId], ([$openTabs, $activeTabId]) => {
	return $openTabs.find((tab) => tab.id === $activeTabId) || null;
});

export const connectionCount = derived(connections, ($connections) => $connections.length);

export const openTabCount = derived(openTabs, ($openTabs) => $openTabs.length);

// Helper functions
export function addConnection(connection: Connection) {
	connections.update((conns) => {
		// Deactivate other connections
		const updatedConns = conns.map((conn) => ({ ...conn, isActive: false }));
		return [...updatedConns, { ...connection, isActive: true }];
	});
	selectedConnection.set(connection);
	isConnected.set(true);
}

export function removeConnection(connectionName: string) {
	connections.update((conns) => {
		const filtered = conns.filter((conn) => conn.name !== connectionName);
		return filtered;
	});

	// Close tabs associated with this connection
	openTabs.update((tabs) => {
		return tabs.filter((tab) => tab.connectionName !== connectionName);
	});

	// If this was the selected connection, select another one or set to null
	selectedConnection.update((current) => {
		if (current?.name === connectionName) {
			connections.subscribe((conns) => {
				const remaining = conns.filter((conn) => conn.name !== connectionName);
				if (remaining.length > 0) {
					remaining[0].isActive = true;
					selectedConnection.set(remaining[0]);
				} else {
					selectedConnection.set(null);
					isConnected.set(false);
				}
			})();
			return null;
		}
		return current;
	});
}

export function selectConnection(connection: Connection) {
	connections.update((conns) =>
		conns.map((conn) => ({
			...conn,
			isActive: conn.name === connection.name
		}))
	);
	selectedConnection.set(connection);

	// Clear database and table selection
	databases.set([]);
	tables.set([]);
	selectedDatabase.set(null);
}

export function selectDatabase(database: Database) {
	databases.update((dbs) =>
		dbs.map((db) => ({
			...db,
			isSelected: db.name === database.name
		}))
	);
	selectedDatabase.set(database);

	// Clear table selection
	tables.update((tbls) => tbls.map((tbl) => ({ ...tbl, isSelected: false })));
}

export function addTab(tab: Omit<Tab, 'id' | 'isActive'>) {
	const newTab: Tab = {
		...tab,
		id: `${tab.connectionName}-${tab.databaseName}-${tab.tableName}-${Date.now()}`,
		isActive: true
	};

	openTabs.update((tabs) => {
		// Deactivate other tabs
		const updatedTabs = tabs.map((t) => ({ ...t, isActive: false }));
		return [...updatedTabs, newTab];
	});

	activeTabId.set(newTab.id);
}

export function closeTab(tabId: string) {
	openTabs.update((tabs) => {
		const filtered = tabs.filter((tab) => tab.id !== tabId);

		// If we closed the active tab, activate another one
		const wasActive = tabs.find((tab) => tab.id === tabId)?.isActive;
		if (wasActive && filtered.length > 0) {
			filtered[filtered.length - 1].isActive = true;
			activeTabId.set(filtered[filtered.length - 1].id);
		} else if (filtered.length === 0) {
			activeTabId.set(null);
		}

		return filtered;
	});
}

export function setActiveTab(tabId: string) {
	openTabs.update((tabs) =>
		tabs.map((tab) => ({
			...tab,
			isActive: tab.id === tabId
		}))
	);
	activeTabId.set(tabId);
}

export function updateTabData(tabId: string, data: Partial<Tab>) {
	openTabs.update((tabs) => tabs.map((tab) => (tab.id === tabId ? { ...tab, ...data } : tab)));
}

export async function loadTabData(tabId: string, page: number = 1, pageSize: number = 50) {
	// Set loading state
	updateTabData(tabId, { isLoading: true, error: undefined });

	// Find the tab
	let targetTab: Tab | null = null;
	const unsubscribe = openTabs.subscribe((tabs) => {
		targetTab = tabs.find((tab) => tab.id === tabId) || null;
	});
	unsubscribe();

	if (!targetTab) {
		console.error('Tab not found:', tabId);
		return;
	}

	// Type assertion to help TypeScript understand targetTab is not null here
	const tab = targetTab as Tab;

	try {
		const result = await getTableData(
			tab.connectionName,
			tab.databaseName,
			tab.tableName,
			page,
			pageSize
		);

		if (result.success && result.data) {
			updateTabData(tabId, {
				isLoading: false,
				data: result.data,
				error: undefined
			});
		} else {
			updateTabData(tabId, {
				isLoading: false,
				error: result.error || 'Failed to load table data'
			});
		}
	} catch (error) {
		console.error('Error loading tab data:', error);
		updateTabData(tabId, {
			isLoading: false,
			error: String(error)
		});
	}
}

export function refreshTabData(tabId: string) {
	const targetTab = get(openTabs).find((tab) => tab.id === tabId) || null;

	if (targetTab && targetTab.data) {
		loadTabData(tabId, targetTab.data.currentPage, targetTab.data.pageSize);
	} else {
		loadTabData(tabId);
	}
}

export function changeTabPage(tabId: string, page: number) {
	const targetTab = get(openTabs).find((tab) => tab.id === tabId) || null;

	if (targetTab && targetTab.data) {
		loadTabData(tabId, page, targetTab.data.pageSize);
	}
}

export function changeTabPageSize(tabId: string, pageSize: number) {
	const targetTab = get(openTabs).find((tab) => tab.id === tabId) || null;

	if (targetTab) {
		loadTabData(tabId, 1, pageSize);
	}
}

export function closeAllTabs() {
	openTabs.set([]);
	activeTabId.set(null);
}
