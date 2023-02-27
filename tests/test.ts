import { expect, test } from "@playwright/test";

test("autofills url using browser slug", async ({ page }) => {
	const url = "/news/world/russia-sanctions-compliance-experts-1.6759244";
	await page.goto(url);
	await expect(page.getByTestId("url-input")).toHaveValue("https://www.cbc.ca/" + url);
});
