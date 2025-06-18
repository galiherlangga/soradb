<script lang="ts">
	import '../app.css';

	export const prerender = true;
	export const ssr = false;
	export const csr = true;

	let { children } = $props();
</script>


<div class="bg-gray-800 min-h-screen w-full">
    {@render children()}
</div>

