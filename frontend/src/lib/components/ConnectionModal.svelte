<script lang="ts">
	import { connectToDB } from '$lib/backends/connect';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	export let show: boolean = false;

	let dbType = 'mysql';
	let host = 'localhost',
		port = 3306,
		user = '',
		password = '',
		dbName = '';
	let isConnecting = false;

	const connect = async () => {
		if (isConnecting) return;

		isConnecting = true;
		let dsn = '';
		if (dbType === 'sqlite') {
			dsn = `file:${dbName}`;
		} else if (dbType === 'postgres') {
			dsn = `postgres://${user}:${password}@${host}:${port}/${dbName}`;
		} else if (dbType == 'mysql') {
			dsn = `${user}:${password}@tcp(${host}:${port})/${dbName}`;
		}

		// Use a meaningful connection name if dbName is empty
		const connectionName = dbName || `${dbType}-${host}-${port}`;

		const result = await connectToDB({ name: connectionName, driver: dbType, dsn: dsn });

		if (result.success) {
			show = false;
			dispatch('connected', { dbName: connectionName, driver: dbType });
		} else {
			console.error('Connection failed:', result.error);
			alert(`Connection failed: ${result.error}`);
		}

		isConnecting = false;
	};

	const closeModal = () => {
		if (!isConnecting) {
			show = false;
		}
	};
</script>

{#if show}
	<div class="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
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
				<!-- Database Type Selector -->
				<div class="space-y-2">
					<label for="dbType" class="text-sm font-medium text-gray-300">Database Type</label>
					<div class="relative">
						<select
							bind:value={dbType}
							class="focus:bg-gray-750 hover:bg-gray-750 w-full cursor-pointer appearance-none rounded-lg border-0 bg-gray-800 px-4 py-3 pr-10 text-white transition-all duration-200 focus:ring-2 focus:ring-green-500/40 focus:outline-none"
						>
							<option value="mysql" class="bg-gray-800 py-2 text-white">MySQL</option>
							<option value="sqlite" class="bg-gray-800 py-2 text-white">SQLite</option>
							<option value="postgres" class="bg-gray-800 py-2 text-white">PostgreSQL</option>
						</select>
						<!-- Custom Arrow -->
						<div class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
							<svg
								class="h-5 w-5 text-gray-400 transition-colors duration-200"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M8 9l4-4 4 4m0 6l-4 4-4-4"
								></path>
							</svg>
						</div>
						<!-- Focus indicator -->
						<div
							class="pointer-events-none absolute inset-0 rounded-lg opacity-0 ring-2 ring-green-500/40 transition-opacity duration-200 group-focus-within:opacity-100"
						></div>
					</div>
				</div>

				{#if dbType !== 'sqlite'}
					<!-- Host -->
					<div class="space-y-2">
						<label for="host" class="text-sm font-medium text-gray-300">Host</label>
						<input
							placeholder="localhost"
							bind:value={host}
							class="focus:bg-gray-750 hover:bg-gray-750 w-full rounded-lg border-0 bg-gray-800 px-4 py-3 text-white placeholder-gray-400 transition-all duration-200 focus:ring-2 focus:ring-green-500/40 focus:outline-none"
						/>
					</div>

					<!-- Port -->
					<div class="space-y-2">
						<label for="port" class="text-sm font-medium text-gray-300">Port</label>
						<input
							placeholder="3306"
							type="number"
							bind:value={port}
							class="focus:bg-gray-750 hover:bg-gray-750 w-full rounded-lg border-0 bg-gray-800 px-4 py-3 text-white placeholder-gray-400 transition-all duration-200 focus:ring-2 focus:ring-green-500/40 focus:outline-none"
						/>
					</div>

					<!-- User -->
					<div class="space-y-2">
						<label for="user" class="text-sm font-medium text-gray-300">Username</label>
						<input
							placeholder="username"
							bind:value={user}
							class="focus:bg-gray-750 hover:bg-gray-750 w-full rounded-lg border-0 bg-gray-800 px-4 py-3 text-white placeholder-gray-400 transition-all duration-200 focus:ring-2 focus:ring-green-500/40 focus:outline-none"
						/>
					</div>

					<!-- Password -->
					<div class="space-y-2">
						<label for="password" class="text-sm font-medium text-gray-300">Password</label>
						<input
							placeholder="password"
							type="password"
							bind:value={password}
							class="focus:bg-gray-750 hover:bg-gray-750 w-full rounded-lg border-0 bg-gray-800 px-4 py-3 text-white placeholder-gray-400 transition-all duration-200 focus:ring-2 focus:ring-green-500/40 focus:outline-none"
						/>
					</div>
				{/if}

				<!-- Database Name / File Path -->
				<div class="space-y-2">
					<label for="dbName" class="text-sm font-medium text-gray-300">
						{dbType === 'sqlite' ? 'Database File Path' : 'Database Name'}
					</label>
					<input
						placeholder={dbType === 'sqlite' ? '/path/to/database.db' : 'database_name'}
						bind:value={dbName}
						class="focus:bg-gray-750 hover:bg-gray-750 w-full rounded-lg border-0 bg-gray-800 px-4 py-3 text-white placeholder-gray-400 transition-all duration-200 focus:ring-2 focus:ring-green-500/40 focus:outline-none"
					/>
				</div>
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
</style>
