export function formatRowCount(count?: number): string {
	if (!count) return '';
	if (count < 1000) return count.toString();
	if (count < 1000000) return `${(count / 1000).toFixed(1)}K`;
	return `${(count / 1000000).toFixed(1)}M`;
}

export function generateId(prefix: string = ''): string {
	const timestamp = Date.now();
	const random = Math.random().toString(36).substr(2, 9);
	return prefix ? `${prefix}-${timestamp}-${random}` : `${timestamp}-${random}`;
}

export function debounce<T extends (...args: any[]) => void>(
	func: T,
	wait: number
): (...args: Parameters<T>) => void {
	let timeout: ReturnType<typeof setTimeout>;
	return (...args: Parameters<T>) => {
		clearTimeout(timeout);
		timeout = setTimeout(() => func(...args), wait);
	};
}

export function truncateText(text: string, maxLength: number): string {
	if (text.length <= maxLength) return text;
	return text.slice(0, maxLength) + '...';
}

export function getTableIcon(type: 'table' | 'view'): string {
	if (type === 'view') {
		return 'M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z';
	}
	return 'M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z M3 7l9-4 9 4';
}

export function getDatabaseTypeIcon(driver: string): string {
	switch (driver.toLowerCase()) {
		case 'mysql':
			return 'M';
		case 'postgresql':
		case 'postgres':
			return 'P';
		case 'sqlite':
			return 'S';
		default:
			return 'D';
	}
}

export function formatBytes(bytes: number): string {
	if (bytes === 0) return '0 B';
	const k = 1024;
	const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
	const i = Math.floor(Math.log(bytes) / Math.log(k));
	return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export function formatDate(date: Date | string): string {
	const d = typeof date === 'string' ? new Date(date) : date;
	return d.toLocaleString();
}

export function isValidConnectionName(name: string): boolean {
	return name.trim().length > 0 && /^[a-zA-Z0-9_-]+$/.test(name.trim());
}

export function buildDSN(config: {
	driver: string;
	host?: string;
	port?: number;
	username?: string;
	password?: string;
	database?: string;
	filePath?: string;
}): string {
	const { driver, host, port, username, password, database, filePath } = config;

	switch (driver.toLowerCase()) {
		case 'mysql':
			return `${username}:${password}@tcp(${host}:${port})/${database || ''}`;
		case 'postgresql':
		case 'postgres':
			return `postgres://${username}:${password}@${host}:${port}/${database || ''}`;
		case 'sqlite':
			return `file:${filePath}`;
		default:
			throw new Error(`Unsupported database driver: ${driver}`);
	}
}

export function parseTableMetadata(rawTable: any): {
	name: string;
	type: 'table' | 'view';
	rowCount?: number;
} {
	return {
		name: rawTable.name || rawTable.TABLE_NAME || rawTable.table_name || '',
		type:
			(rawTable.type || rawTable.TABLE_TYPE || 'table').toLowerCase() === 'view'
				? ('view' as const)
				: ('table' as const),
		rowCount: rawTable.rowCount || rawTable.TABLE_ROWS || undefined
	};
}

export function validateConnectionConfig(config: any): {
	isValid: boolean;
	errors: string[];
} {
	const errors: string[] = [];

	if (!config.name || !config.name.trim()) {
		errors.push('Connection name is required');
	} else if (!isValidConnectionName(config.name)) {
		errors.push('Connection name can only contain letters, numbers, underscores, and hyphens');
	}

	if (!config.driver) {
		errors.push('Database driver is required');
	}

	if (config.driver !== 'sqlite') {
		if (!config.host || !config.host.trim()) {
			errors.push('Host is required');
		}
		if (!config.port || config.port <= 0) {
			errors.push('Valid port number is required');
		}
		if (!config.username || !config.username.trim()) {
			errors.push('Username is required');
		}
		// Database name is optional - if provided, it will be auto-selected
	} else {
		if (!config.filePath || !config.filePath.trim()) {
			errors.push('File path is required for SQLite');
		}
	}

	return {
		isValid: errors.length === 0,
		errors
	};
}

export function sanitizeTabTitle(
	connectionName: string,
	databaseName: string,
	tableName: string
): string {
	const maxLength = 30;
	const fullTitle = `${tableName} (${databaseName})`;
	return truncateText(fullTitle, maxLength);
}

export function copyToClipboard(text: string): Promise<void> {
	if (navigator.clipboard && navigator.clipboard.writeText) {
		return navigator.clipboard.writeText(text);
	} else {
		// Fallback for older browsers
		return new Promise((resolve, reject) => {
			const textArea = document.createElement('textarea');
			textArea.value = text;
			textArea.style.top = '0';
			textArea.style.left = '0';
			textArea.style.position = 'fixed';
			document.body.appendChild(textArea);
			textArea.focus();
			textArea.select();
			try {
				document.execCommand('copy');
				resolve();
			} catch (err) {
				reject(err);
			}
			document.body.removeChild(textArea);
		});
	}
}
