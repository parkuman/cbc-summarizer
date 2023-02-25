<script lang="ts">
	import { onMount } from "svelte";

	let url = "";
	let summary = "";
	let loading = false;
  let error = "";

	async function summarize() {
		// reset the values to get ready for new summary
		summary = "";
		error = "";
		loading = true;

		const summaryRes = await fetch("/api/summarize", {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({ url })
		});

    const resJson = await summaryRes.json();

    if (summaryRes.ok) {
      summary = resJson;
    } else {
      error = resJson.message;
    }

		loading = false;
	}
</script>

<h1 id="title">AI-Powered <span style:color="var(--colour-primary)">CBC</span> News Article Summarizer</h1>
<h2>
	Paste the link of any <span style:color="var(--colour-primary)">CBC news</span> article below:
</h2>
<input id="url" type="url" bind:value={url} />
<button type="submit" on:click={summarize}>{loading ? "Summarizing..." : "Summarize!"}</button>

{#if error}
<h2>Error</h2>
  <p>{error}</p>
{/if}
{#if summary}
	<hr />

	<h1 id="summary">Summary</h1>
	<ul>
		{#each summary as summaryPt}
			<li>
				<p>{summaryPt}</p>
			</li>
		{/each}
	</ul>
{/if}

<style>

  h1, h2 {
    text-align: center;
  }
	input {
		width: 100%;
		height: 30px;
		border-radius: 10px;
		padding: 10px;
    background-color: var(--colour-bg);
	}

	button {
		width: 300px;
		height: 50px;
		border: none;
		border-radius: 10px;
		color: white;
		background-color: var(--colour-primary);
		margin-top: 50px;
	}

	button:hover {
		cursor: pointer;
		background-color: rgba(var(--colour-primary-rgb), 0.6);
	}

  ul {
    padding: 0;
    margin: 0;
  }

	#title {
    margin: 100px 0px;
	}

	#summary {
		margin-top: 100px;
	}
</style>
