import { GetDatabases, GetTables } from '../../../wailsjs/go/main/DBService';
import type {
	DatabaseServiceResponse,
	TableMetadata,
	TableData,
	TableColumn,
	TableRow
} from '../types';
import { parseTableMetadata } from '../utils';

export async function getDatabases(
	connectionName: string
): Promise<DatabaseServiceResponse<string[]>> {
	try {
		const databases = await GetDatabases(connectionName);
		return {
			success: true,
			data: databases
		};
	} catch (error) {
		console.error('Error getting databases:', error);
		return {
			success: false,
			error: String(error) || 'Unknown error'
		};
	}
}

export async function getTables(
	connectionName: string,
	databaseName: string
): Promise<DatabaseServiceResponse<TableMetadata[]>> {
	try {
		const rawTables = await GetTables(connectionName, databaseName);
		const tables = rawTables.map(parseTableMetadata);
		return {
			success: true,
			data: tables
		};
	} catch (error) {
		console.error('Error getting tables:', error);
		return {
			success: false,
			error: String(error) || 'Unknown error'
		};
	}
}

export async function getTableData(
	connectionName: string,
	databaseName: string,
	tableName: string,
	page: number = 1,
	pageSize: number = 50
): Promise<DatabaseServiceResponse<TableData>> {
	try {
		// TODO: Implement GetTableData in Go backend
		// For now, return mock data
		const mockTableData: TableData = {
			columns: [
				{ name: 'id', type: 'int', nullable: false, primaryKey: true, autoIncrement: true },
				{
					name: 'name',
					type: 'varchar(255)',
					nullable: false,
					primaryKey: false,
					autoIncrement: false
				},
				{
					name: 'email',
					type: 'varchar(255)',
					nullable: true,
					primaryKey: false,
					autoIncrement: false
				},
				{
					name: 'created_at',
					type: 'timestamp',
					nullable: false,
					primaryKey: false,
					autoIncrement: false
				}
			],
			rows: Array.from({ length: Math.min(pageSize, 50) }, (_, i) => ({
				id: (page - 1) * pageSize + i + 1,
				name: `User ${(page - 1) * pageSize + i + 1}`,
				email: `user${(page - 1) * pageSize + i + 1}@example.com`,
				created_at: new Date().toISOString()
			})),
			totalRows: 1000, // Mock total
			currentPage: page,
			pageSize: pageSize
		};

		// Simulate loading delay
		await new Promise((resolve) => setTimeout(resolve, 500));

		return {
			success: true,
			data: mockTableData
		};
	} catch (error) {
		console.error('Error getting table data:', error);
		return {
			success: false,
			error: String(error) || 'Unknown error'
		};
	}
}
