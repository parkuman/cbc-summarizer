<script lang="ts">
	import { onMount } from "svelte";

	let url = "";
	let summary = "";
	let loading = false;

	async function summarize() {
		// reset the values to get ready for new summary
		summary = "";
		loading = true;

		const summmaryRes = await fetch("/api/summarize", {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({ url })
		});

		summary = await summmaryRes.json();
		loading = false;
	}
</script>

<h1>News Article Summarizer</h1>
<input id="url" type="url" bind:value={url} />
<button type="submit" on:click={summarize}>Summarize!</button>

<h2>Summary</h2>
{#if loading}
	<p>loading...</p>
{:else}
	<ul>
		{#each summary as summaryPt}
			<li>
				<p>{summaryPt}</p>
			</li>
		{/each}
	</ul>
{/if}
