<div align="center">
  <h1>🍁 CBC Article Summarizer 📰</h1>
  <p>
    <strong>Summarize any CBC article using <a href="https://cohere.ai/" target="_blank" rel="noreferrer">cohere.ai's summarize API</a></strong>
  </p>

   <h3>
    <a target="_blank" rel="noopener noreferrer" href="https://prowe-article-summarizer.netlify.app">Website</a>
  </h3>

[demo.webm](https://user-images.githubusercontent.com/44420929/221619290-383c9444-2590-47b6-8cc4-ec8c80b751c7.webm)

</div>

## Explanation

#

This webapp takes the CBC.ca url and fetches fetches the article's text content in a GET request. After filtering out some common filler DOM elements in those articles, it then feeds the article content into Cohere's summarize API (currently in beta) and outputs the response to the user!

## Run it Yourself

#

To run this on your machine:

1. clone the repo
2. create a `.env` file in the root directory of the project
3. following make your `.env` file look like `.env.example`, then you can paste in your own Cohere API key
