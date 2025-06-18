export interface Connection {
	name: string;
	driver: string;
	isActive: boolean;
}

export interface Database {
	name: string;
	isSelected: boolean;
}

export interface Table {
	name: string;
	type: 'table' | 'view';
	rowCount?: number;
	isSelected: boolean;
}

export interface TableData {
	columns: TableColumn[];
	rows: TableRow[];
	totalRows: number;
	currentPage: number;
	pageSize: number;
}

export interface TableColumn {
	name: string;
	type: string;
	nullable: boolean;
	primaryKey: boolean;
	autoIncrement: boolean;
}

export interface TableRow {
	[columnName: string]: any;
}

export interface Tab {
	id: string;
	connectionName: string;
	databaseName: string;
	tableName: string;
	tableType: 'table' | 'view';
	isActive: boolean;
	isLoading: boolean;
	data?: TableData;
	error?: string;
}

export interface ConnectionConfig {
	name: string;
	driver: 'mysql' | 'postgresql' | 'sqlite';
	host?: string;
	port?: number;
	username?: string;
	password?: string;
	database?: string;
	filePath?: string; // for SQLite
}

export interface DatabaseServiceResponse<T> {
	success: boolean;
	data?: T;
	error?: string;
}

export interface TableMetadata {
	name: string;
	type: 'table' | 'view';
	rowCount?: number;
	columns?: TableColumn[];
	schema?: string;
	createdAt?: string;
	updatedAt?: string;
}
