<script>
	// import global styles
	import "../styles.css";
</script>

<svelte:head>
	<title>CBC Article Summarizer</title>
	<meta name="description" content="Summarize any CBC article using cohere.ai's summarize API" />
	<meta property="og:url" content="https://prowe-cbc-summarizer.netlify.app/" />
	<link rel="canonical" href="https://prowe-cbc-summarizer.netlify.app/" />
	<meta property="og:site_name" content="CBC Article Summarizer" />
	<meta property="og:description" content="Summarize any CBC article using cohere.ai's summarize API" />
	<meta property="og:title" content="CBC Article Summarizer" />
	<meta property="og:image" content="/screenshot.jpg" />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content="CBC Article Summarizer" />
	<meta name="twitter:description" content="Summarize any CBC article using cohere.ai's summarize API" />
	<meta name="twitter:image" content="/screenshot.jpg" />
</svelte:head>
<main>
	<div class="content">
		<slot />
	</div>
	<footer>
		<p>
			Powered by <a rel="noreferrer" target="_blank" href="https://cohere.ai/">Cohere AI</a>,
			<a rel="noreferrer" target="_blank" href="https://kit.svelte.dev/">SvelteKit</a>, and
			<a rel="noreferrer" target="_blank" href="https://www.netlify.com/">Netlify</a>
		</p>
		<p>
			<a rel="noreferrer" target="_blank" href="https://github.com/parkuman/cbc-summarizer"
				>View the source on Github</a
			>
		</p>
	</footer>
</main>
