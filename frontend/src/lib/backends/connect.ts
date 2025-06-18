import { Connect } from '../../../wailsjs/go/main/DBService';
import type { DatabaseServiceResponse, ConnectionConfig } from '../types';

export async function connectToDB(params: {
	name: string;
	driver: string;
	dsn: string;
}): Promise<DatabaseServiceResponse<void>> {
	try {
		await Connect(params.name, params.driver, params.dsn);
		return {
			success: true
		};
	} catch (error) {
		console.error('Error connecting to database:', error);
		return {
			success: false,
			error: String(error) || 'Unknown error'
		};
	}
}

export async function testConnection(
	config: ConnectionConfig
): Promise<DatabaseServiceResponse<void>> {
	// This would be used to test connection before saving
	// For now, it's the same as connectToDB but could be extended
	return connectToDB({
		name: config.name,
		driver: config.driver,
		dsn: buildDSNFromConfig(config)
	});
}

function buildDSNFromConfig(config: ConnectionConfig): string {
	const { driver, host, port, username, password, database, filePath } = config;

	switch (driver) {
		case 'mysql':
			return `${username}:${password}@tcp(${host}:${port})/${database}`;
		case 'postgresql':
			return `postgres://${username}:${password}@${host}:${port}/${database}`;
		case 'sqlite':
			return `file:${filePath}`;
		default:
			throw new Error(`Unsupported database driver: ${driver}`);
	}
}
