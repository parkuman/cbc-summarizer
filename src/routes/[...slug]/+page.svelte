<script lang="ts">
	import { page } from "$app/stores";

	let summary = "";
	let loading = false;
	let error = "";

	let advancedOptions = false;
	let url = "";
	let summaryLength = "MEDIUM";
	let summaryFormat = "BULLETS";
	let summaryExtractiveness = "LOW";
	let summaryTemperature = 0.1;
	let summaryAdditionalCommand = "";

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
			body: JSON.stringify({
				url,
				summaryExtractiveness,
				summaryFormat,
				summaryLength,
				summaryTemperature,
				summaryAdditionalCommand
			})
		});

		const resJson = await summaryRes.json();

		if (summaryRes.ok) {
			summary = resJson;
		} else {
			error = resJson.message;
		}

		loading = false;

		// on next frame (after state update), scroll to the output
		requestAnimationFrame(() => {
			const output = document.querySelector(".output");
			if (!output) return;
			output.scrollIntoView({
				behavior: "smooth"
			});
		});
	}

	// on page load, set the url state variable to the slug plus cbc pre (only if there is a url provided)
	url = $page.params.slug !== "" ? "https://www.cbc.ca/" + $page.params.slug : "";
</script>

<h1 id="title">
	AI-Powered <span style:color="var(--colour-primary)">CBC</span> News Article Summarizer
</h1>
<sub id="urlTip">
	<div>i</div>
	On any CBC article you can replace "www.cbc.ca" with "{$page.url
		.toString()
		.substring($page.url.toString().indexOf(":") + 3)
		.slice(0, -1)}" in your browser's search bar for a quick way to summarize the article you're
	reading!
</sub>
<h2>
	Paste the link of any <span style:color="var(--colour-primary)">CBC news</span> article below:
</h2>

<input data-testid="url-input" id="url" type="url" bind:value={url} />

<!-- advanced options -->
<button
	on:click={() => {
		advancedOptions = !advancedOptions;
	}}
	id="advancedOptionsBtn"
>
	Advanced Options <span style:margin-left="5px">{advancedOptions ? "↑" : "↓"}</span>
</button>
{#if advancedOptions}
	<div id="advancedOptionsPanel">
		<p>
			These are custom options passed to
			<a href="https://docs.cohere.ai/reference/summarize-2" target="_blank" rel="noreferrer"
				>Cohere's Summarize API</a
			>
		</p>
		<!-- length -->
		<div>
			<label for="summaryLength">Length</label>
			<p class="hint">approximate length of the summary</p>
			<select id="summaryLength" bind:value={summaryLength}>
				<option value="SHORT">SHORT</option>
				<option value="MEDIUM">MEDIUM</option>
				<option value="LONG">LONG</option>
			</select>
		</div>

		<!-- format -->
		<div>
			<label for="summaryFormat">Format</label>
			<p class="hint">Summary will output as a paragraph or in bullet points</p>
			<select bind:value={summaryFormat}>
				<option value="BULLETS">BULLETS</option>
				<option value="PARAGRAPH">PARAGRAPH</option>
			</select>
		</div>

		<!-- extractiveness -->
		<div>
			<label for="summaryExtractiveness">Extractiveness</label>
			<p class="hint">
				Controls how close to the original text the summary is. high extractiveness leans toward
				reusing sentences verbatim, while `low` extractiveness paraphrase more.
			</p>
			<select bind:value={summaryExtractiveness}>
				<option value="LOW">LOW</option>
				<option value="MEDIUM">MEDIUM</option>
				<option value="HIGH">HIGH</option>
			</select>
		</div>

		<!-- temperature -->
		<div>
			<label for="summaryTemperature">Temperature</label>
			<p class="hint">
				Ranges from 0 to 5. Controls the randomness of the output. Lower values tend to generate
				more "predictable" output, while higher values tend to generate more "creative" output. For
				a summary you generally wnat a lower temperature, if not 0.
			</p>
			{summaryTemperature}
			<input type="range" step="0.005" min="0" max="5" bind:value={summaryTemperature} />
		</div>

		<!-- additional command -->
		<div>
			<label for="summaryAdditionalCommand">Additional Command</label>
			<p class="hint">
				A free-form instruction for modifying how the summaries get generated. Should complete the
				sentence "Generate a summary _". Eg. "focusing on the next steps" or "written by Yoda"
			</p>
			<input type="text" bind:value={summaryAdditionalCommand} placeholder="written by yoda" />
		</div>
	</div>
{/if}

<button data-testid="submit-btn" type="submit" id="submit" on:click={summarize}
	>{loading ? "Summarizing..." : "Summarize!"}</button
>

{#if error}
	<hr />
	<div class="output" style:text-align="center">
		<h2>Error</h2>
		<p>{error}</p>
	</div>
{/if}

{#if summary}
	<hr />

	<h1 class="output" id="summary">Summary</h1>
	<ul>
		{#each summary as summaryPt}
			<li>
				<p>{summaryPt}</p>
			</li>
		{/each}
	</ul>
{/if}

<style>
	h1,
	h2 {
		text-align: center;
	}

	input,
	select {
		width: 100%;
		height: 30px;
		border: 1px solid var(--colour-text);
		color: var(--colour-text);
		border-radius: 10px;
		padding: 5px;
		background-color: var(--colour-bg);
		font-family: monospace;
	}

	#submit {
		width: 300px;
		height: 50px;
		border: none;
		border-radius: 10px;
		color: white;
		background-color: var(--colour-primary);
		margin-top: 50px;
	}

	#submit:hover {
		background-color: rgba(var(--colour-primary-rgb), 0.6);
	}

	button:hover {
		cursor: pointer;
	}

	ul {
		padding: 0;
		margin: 0;
	}

	#title {
		margin-top: 100px;
		margin-bottom: 20px;
		font-weight: bolder;
		font-size: 3rem;
	}

	#urlTip {
		margin-bottom: 75px;
		text-align: center;
		/* border: 1px solid gray; */
		border-radius: 20px;
		padding: 10px;
		color: white;
		background-color: rgba(var(--colour-primary-rgb), 0.4);
		max-width: 90%;
		font-size: 0.8rem;
	}

	/* info icon */
	#urlTip > div {
		background-color: white;
		-right: 10px;
		float: left;
		position: relative;
		width: 30px;
		height: 30px;
		color: rgba(var(--colour-primary-rgb), 1);
		border-radius: 50px;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 1.5rem;
		font-weight: bold;
	}

	#summary {
		margin-top: 100px;
	}

	#advancedOptionsBtn {
		color: rgba(var(--colour-text-rgb), 0.7);
		margin-top: 15px;
		border: none;
		background: none;
	}

	#advancedOptionsBtn:hover {
		cursor: pointer;
	}

	#advancedOptionsPanel {
		display: flex;
		flex-direction: column;
		width: 100%;
		justify-content: space-evenly;
	}

	#advancedOptionsPanel > p {
		color: rgba(var(--colour-text-rgb), 0.7);
	}

	.hint {
		margin-top: 0;
		font-size: 0.75rem;
		color: rgba(var(--colour-text-rgb), 0.7);
	}

	#advancedOptionsPanel select {
		width: 100%;
		height: 2rem;
	}

	#advancedOptionsPanel div {
		margin-bottom: 20px;
	}

	@media screen and (max-width: 992px) {
		#title {
			font-size: 2rem;
			margin-top: 50px;
		}
	}
</style>
