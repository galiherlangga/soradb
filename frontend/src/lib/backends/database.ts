import { GetDatabases, GetTables } from '../../../wailsjs/go/main/DBService';

export async function getDatabases(connectionName: string) {
	try {
		const databases = await GetDatabases(connectionName);
		return { success: true, databases };
	} catch (error) {
		console.error('Error getting databases:', error);
		return { success: false, error: String(error) || 'Unknown error' };
	}
}

export async function getTables(connectionName: string, databaseName: string) {
	try {
		const tables = await GetTables(connectionName, databaseName);
		return { success: true, tables };
	} catch (error) {
		console.error('Error getting tables:', error);
		return { success: false, error: String(error) || 'Unknown error' };
	}
}
