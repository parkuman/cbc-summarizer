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
	summaryTemperature: string;
	summaryExtractiveness: string;
	summaryFormat: string;
	summaryLength: string;
	summaryAdditionalCommand: string;
};

// initalize Jsdom and cohere SDK
const { JSDOM } = jsdom;
cohere.init(SECRET_COHERE_API_KEY);

export const POST: RequestHandler<SummaryRequestBody> = async ({ request }: RequestEvent) => {
	const body = (await request.json()) as SummaryRequestBody;

	// ===============| BODY VALIDATION |================
	if (
		!body.url ||
		!body.summaryTemperature ||
		!body.summaryExtractiveness ||
		!body.summaryFormat ||
		!body.summaryLength
	) {
		throw error(400, {
			message:
				"Body must include url, summaryTemperature, summaryExtractiveness, summaryFormat, and summaryLength"
		});
	}

	const { url, summaryTemperature, summaryExtractiveness, summaryFormat, summaryLength } = body;

	// didn't want to bother over-checking this url since cbc has some mobile sites and such that are also valid
	if (!url.includes("cbc.ca")) {
		throw error(400, {
			message: "URL is not a valid cbc.ca article"
		});
	}

	if (
		summaryExtractiveness !== "LOW" &&
		summaryExtractiveness !== "MEDIUM" &&
		summaryExtractiveness !== "HIGH"
	) {
		throw error(400, {
			message: "summaryExtractiveness must be 'LOW', 'MEDIUM' or 'HIGH'"
		});
	}

	if (summaryLength !== "SHORT" && summaryLength !== "MEDIUM" && summaryLength !== "LONG") {
		throw error(400, {
			message: "summaryLength must be 'SHORT', 'MEDIUM' or 'LONG'"
		});
	}

	if (summaryFormat !== "BULLETS" && summaryFormat !== "PARAGRAPH") {
		throw error(400, {
			message: "summaryFormat must be either 'BULLETS' or 'PARAGRAPH'"
		});
	}

	const summaryTemperatureNum = parseFloat(summaryTemperature);
	if (summaryTemperatureNum < 0 || summaryTemperatureNum > 5) {
		throw error(400, {
			message: "summaryTemperature must be a number between 0 and 5"
		});
	}

	// ===============| SUMMARIZE |================
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

		const summaryResponse = await cohere.summarize({
			text: articleEl.textContent as string,
			temperature: summaryTemperatureNum,
			extractiveness: summaryExtractiveness,
			format: summaryFormat,
			length: summaryLength,
			additional_command: body.summaryAdditionalCommand ?? null // if no additional command passed, just pass null
		});

		const summary = summaryResponse.body.summary;
		const splitPoints = summary.split("\n- "); // split the points up by '\n- ', this should
		// ensure we don't accidentaly split it some other way

		splitPoints[0] = splitPoints[0].replace("- ", ""); // replace the initial bullet point too

		const response = json(splitPoints);
  	response.headers.append('Access-Control-Allow-Origin', "*");
  	return response;
	} catch (err) {
		console.error("issues fetching article content");
		throw error(400, {
			message: "issues fetching article content from that URL. please ensure it is a valid article"
		});
	}
};
