<script lang="ts">
	import { connectToDB } from '$lib/backends/connect';
	import { createEventDispatcher } from 'svelte';
	import type { ConnectionConfig } from '$lib/types';
	import { buildDSN, validateConnectionConfig } from '$lib/utils';

	const dispatch = createEventDispatcher();

	export let show: boolean = false;

	let dbType: 'mysql' | 'postgresql' | 'sqlite' = 'mysql';
	let host = 'localhost';
	let port = 3306;
	let user = '';
	let password = '';
	let dbName = '';
	let filePath = '';
	let isConnecting = false;
	let errors: string[] = [];

	const connect = async () => {
		if (isConnecting) return;

		errors = [];

		const config: ConnectionConfig = {
			name: dbName || `${dbType}-${host}-${port}`,
			driver: dbType,
			host,
			port,
			username: user,
			password,
			database: dbName,
			filePath
		};

		const validation = validateConnectionConfig(config);
		if (!validation.isValid) {
			errors = validation.errors;
			return;
		}

		isConnecting = true;

		try {
			const dsn = buildDSN(config);
			const result = await connectToDB({
				name: config.name,
				driver: config.driver,
				dsn
			});

			if (result.success) {
				show = false;
				dispatch('connected', {
					dbName: config.name,
					driver: config.driver,
					selectedDatabase: config.database || undefined
				});
				resetForm();
			} else {
				errors = [result.error || 'Connection failed'];
			}
		} catch (error) {
			errors = [String(error)];
		} finally {
			isConnecting = false;
		}
	};

	const resetForm = () => {
		dbType = 'mysql';
		host = 'localhost';
		port = 3306;
		user = '';
		password = '';
		dbName = '';
		filePath = '';
		errors = [];
	};

	const closeModal = () => {
		if (!isConnecting) {
			show = false;
			resetForm();
		}
	};

	// Update port when database type changes
	$: if (dbType === 'mysql') {
		port = 3306;
	} else if (dbType === 'postgresql') {
		port = 5432;
	}
</script>

{#if show}
	<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
		<div
			class="w-[420px] rounded-xl border border-gray-700/50 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6 shadow-2xl backdrop-blur-md"
		>
			<!-- Header -->
			<div class="mb-6 text-center">
				<h2
					class="bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-2xl font-bold text-transparent"
				>
					Connect to Database
				</h2>
				<div
					class="mt-2 h-px bg-gradient-to-r from-transparent via-green-500/50 to-transparent"
				></div>
			</div>

			<div class="space-y-4">
				<!-- Error Display -->
				{#if errors.length > 0}
					<div class="rounded-lg border border-red-500/20 bg-red-500/10 p-3">
						<div class="mb-2 flex items-center gap-2">
							<svg
								class="h-4 w-4 text-red-400"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
								/>
							</svg>
							<span class="text-sm font-medium text-red-400">Connection Error</span>
						</div>
						<ul class="space-y-1 text-xs text-red-300">
							{#each errors as error}
								<li>• {error}</li>
							{/each}
						</ul>
					</div>
				{/if}

				<!-- Database Type Selector -->
				<div class="space-y-2">
					<label for="dbType" class="text-sm font-medium text-gray-300">Database Type</label>
					<select
						bind:value={dbType}
						class="focus:bg-gray-750 hover:bg-gray-750 w-full cursor-pointer appearance-none rounded-lg border-0 bg-gray-800 px-4 py-3 pr-10 text-white transition-all duration-200 focus:ring-2 focus:ring-green-500/40 focus:outline-none"
						disabled={isConnecting}
					>
						<option value="mysql" class="bg-gray-800 py-2 text-white">MySQL</option>
						<option value="sqlite" class="bg-gray-800 py-2 text-white">SQLite</option>
						<option value="postgresql" class="bg-gray-800 py-2 text-white">PostgreSQL</option>
					</select>
				</div>

				{#if dbType !== 'sqlite'}
					<!-- Host -->
					<div class="space-y-2">
						<label for="host" class="text-sm font-medium text-gray-300">Host</label>
						<input
							placeholder="localhost"
							bind:value={host}
							disabled={isConnecting}
							class="focus:bg-gray-750 hover:bg-gray-750 w-full rounded-lg border-0 bg-gray-800 px-4 py-3 text-white placeholder-gray-400 transition-all duration-200 focus:ring-2 focus:ring-green-500/40 focus:outline-none disabled:opacity-50"
						/>
					</div>

					<!-- Port -->
					<div class="space-y-2">
						<label for="port" class="text-sm font-medium text-gray-300">Port</label>
						<input
							placeholder={dbType === 'mysql' ? '3306' : '5432'}
							type="number"
							bind:value={port}
							disabled={isConnecting}
							class="focus:bg-gray-750 hover:bg-gray-750 w-full rounded-lg border-0 bg-gray-800 px-4 py-3 text-white placeholder-gray-400 transition-all duration-200 focus:ring-2 focus:ring-green-500/40 focus:outline-none disabled:opacity-50"
						/>
					</div>

					<!-- User -->
					<div class="space-y-2">
						<label for="user" class="text-sm font-medium text-gray-300">Username</label>
						<input
							placeholder="username"
							bind:value={user}
							disabled={isConnecting}
							class="focus:bg-gray-750 hover:bg-gray-750 w-full rounded-lg border-0 bg-gray-800 px-4 py-3 text-white placeholder-gray-400 transition-all duration-200 focus:ring-2 focus:ring-green-500/40 focus:outline-none disabled:opacity-50"
						/>
					</div>

					<!-- Password -->
					<div class="space-y-2">
						<label for="password" class="text-sm font-medium text-gray-300">Password</label>
						<input
							placeholder="password"
							type="password"
							bind:value={password}
							disabled={isConnecting}
							class="focus:bg-gray-750 hover:bg-gray-750 w-full rounded-lg border-0 bg-gray-800 px-4 py-3 text-white placeholder-gray-400 transition-all duration-200 focus:ring-2 focus:ring-green-500/40 focus:outline-none disabled:opacity-50"
						/>
					</div>

					<!-- Database Name (Optional) -->
					<div class="space-y-2">
						<label for="dbName" class="text-sm font-medium text-gray-300"
							>Database Name <span class="text-xs text-gray-500">(optional)</span></label
						>
						<input
							placeholder="database_name (leave empty to show all databases)"
							bind:value={dbName}
							disabled={isConnecting}
							class="focus:bg-gray-750 hover:bg-gray-750 w-full rounded-lg border-0 bg-gray-800 px-4 py-3 text-white placeholder-gray-400 transition-all duration-200 focus:ring-2 focus:ring-green-500/40 focus:outline-none disabled:opacity-50"
						/>
						<p class="text-xs text-gray-500">
							If specified, this database will be auto-selected after connection
						</p>
					</div>
				{:else}
					<!-- SQLite File Path -->
					<div class="space-y-2">
						<label for="filePath" class="text-sm font-medium text-gray-300"
							>Database File Path</label
						>
						<input
							placeholder="/path/to/database.db"
							bind:value={filePath}
							disabled={isConnecting}
							class="focus:bg-gray-750 hover:bg-gray-750 w-full rounded-lg border-0 bg-gray-800 px-4 py-3 text-white placeholder-gray-400 transition-all duration-200 focus:ring-2 focus:ring-green-500/40 focus:outline-none disabled:opacity-50"
						/>
					</div>

					<!-- Connection Name for SQLite -->
					<div class="space-y-2">
						<label for="dbName" class="text-sm font-medium text-gray-300">Connection Name</label>
						<input
							placeholder="sqlite-connection"
							bind:value={dbName}
							disabled={isConnecting}
							class="focus:bg-gray-750 hover:bg-gray-750 w-full rounded-lg border-0 bg-gray-800 px-4 py-3 text-white placeholder-gray-400 transition-all duration-200 focus:ring-2 focus:ring-green-500/40 focus:outline-none disabled:opacity-50"
						/>
						<p class="text-xs text-gray-500">A unique name to identify this connection</p>
					</div>
				{/if}
			</div>

			<!-- Actions -->
			<div class="mt-8 flex justify-end gap-3">
				<button
					on:click={closeModal}
					disabled={isConnecting}
					class="rounded-lg border border-gray-600/30 bg-gray-700/50 px-6 py-3 font-medium text-gray-300 transition-all duration-200 hover:bg-gray-600/50 hover:text-white focus:ring-2 focus:ring-gray-500/20 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
				>
					Cancel
				</button>
				<button
					on:click={connect}
					disabled={isConnecting}
					class="group relative overflow-hidden rounded-lg bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-3 font-medium text-white shadow-lg transition-all duration-200 hover:from-green-500 hover:to-emerald-500 hover:shadow-green-500/25 focus:ring-2 focus:ring-green-500/50 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
				>
					{#if isConnecting}
						<div class="flex items-center gap-2">
							<div
								class="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white"
							></div>
							Connecting...
						</div>
					{:else}
						<span class="relative z-10">Connect</span>
						<div
							class="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-400 opacity-0 transition-opacity duration-200 group-hover:opacity-20"
						></div>
					{/if}
				</button>
			</div>

			<!-- Connection Status Indicator -->
			<div class="mt-4 text-center">
				<div class="inline-flex items-center gap-2 text-xs text-gray-400">
					<div class="h-2 w-2 animate-pulse rounded-full bg-green-500"></div>
					Ready to connect
				</div>
			</div>
		</div>
	</div>
{/if}

<style>
	/* Custom scrollbar for select dropdown */
	select option {
		background-color: rgb(31 41 55);
		color: white;
	}

	/* Ensure backdrop blur works */
	.backdrop-blur-sm {
		backdrop-filter: blur(4px);
	}

	.backdrop-blur-md {
		backdrop-filter: blur(12px);
	}

	/* Custom gray-750 color since it's not in default Tailwind */
	.focus\:bg-gray-750:focus,
	.hover\:bg-gray-750:hover {
		background-color: rgb(55 65 81);
	}
</style>
