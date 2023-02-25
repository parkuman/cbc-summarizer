import { json, error } from "@sveltejs/kit";
import type { RequestEvent, RequestHandler } from "@sveltejs/kit";

import cohere from "cohere-ai";
import jsdom from "jsdom";

import { SECRET_COHERE_API_KEY } from "$env/static/private";

if (!SECRET_COHERE_API_KEY) {
	throw new Error(
		"No Cohere API key found in .env. Ensure you have a .env file in the project's root directory with SECRET_COHERE_API_KEY set"
	);
}

type SummaryRequestBody = {
	url: string;
	temperature: string;
	extractiveness: string;
	format: string;
};

// initalize Jsdom and cohere SDK
const { JSDOM } = jsdom;
cohere.init(SECRET_COHERE_API_KEY);

export const POST: RequestHandler<SummaryRequestBody> = async ({ request }: RequestEvent) => {
	const body = (await request.json()) as SummaryRequestBody;

	if (!body.url) {
		throw error(400, {
			message: "Body must include url"
		});
	}

	const { url } = body;

	try {
		const webpageResponse = await fetch(url, {
			method: "GET"
		});

		const webpageText = await webpageResponse.text();

		const webpageDom = new JSDOM(webpageText);

		// ==============| CBC News |==============
		// remove the inline related articles and other pieces of text not related to the main article content
		webpageDom.window.document.querySelectorAll(".similarLinks").forEach((e) => e.remove());
		webpageDom.window.document.querySelectorAll(".image-caption").forEach((e) => e.remove());
		webpageDom.window.document.querySelectorAll(".mediaEmbed").forEach((e) => e.remove());
		const articleEl = webpageDom.window.document.querySelector(".story") as HTMLDivElement;

		// TODO: temperature so its not random and more subjective
		const summaryResponse = await cohere.summarize({
			text: articleEl.textContent as string,
			temperature: 0.1,
			extractiveness: "LOW",
			format: "BULLETS"
		});

		const summary = summaryResponse.body.summary;
		const splitPoints = summary.split("\n- "); 					// split the points up by '\n- ', this should 
																												// ensure we don't accidentaly split it some other way
																												
		splitPoints[0] = splitPoints[0].replace("- ", ""); 	// replace the initial bullet point too

		return json(splitPoints);
	} catch (err) {
		console.error("issues fetching article content");
		throw error(400, {
			message: "issues fetching article content from that URL. please ensure it is a valid article"
		});
	}
};
