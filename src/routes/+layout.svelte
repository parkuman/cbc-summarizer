<script>
	// import global styles
	import "../styles.css";
</script>

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
			<a rel="noreferrer" target="_blank" href="https://github.com/parkuman/article-summarizer"
				>View the source on Github</a
			>
		</p>
	</footer>
</main>
