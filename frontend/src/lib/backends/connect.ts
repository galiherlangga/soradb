import { Connect } from '../../../wailsjs/go/main/DBService';

export async function connectToDB(params: { name: string; driver: string; dsn: string }) {
	try {
		await Connect(params.name, params.driver, params.dsn);
		return { success: true };
	} catch (error) {
		console.error('Error connecting to database:', error);
		return { success: false, error: String(error) || 'Unknown error' };
	}
}
