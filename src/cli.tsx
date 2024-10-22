import { Polar } from "@polar-sh/sdk";
import type { Organization } from "@polar-sh/sdk/models/components/organization.js";
import type { ProductsCreateProductCreate } from "@polar-sh/sdk/models/operations/productscreate.js";
import { login } from "./oauth.js";
import { productPrompt } from "./product.js";
import prompts from "prompts";
import { render } from "ink";
import { Spinner } from "@inkjs/ui";
import React from "react";
import { resolvePackageName } from "./package.js";

const resolveOrganization = async (api: Polar, slug: string) => {
	let organization: Organization | undefined;

	organization = (
		await api.organizations.list({
			slug,
		})
	).result.items[0];

	if (!organization) {
		try {
			organization = await api.organizations.create({
				name: slug,
				slug,
			});
		} catch (e: unknown) {
			const { slug } = await prompts([
				{
					type: "text",
					name: "slug",
					message: "Organization Slug",
				},
			]);

			const random = Math.floor(Math.random() * 1000);
			organization = await api.organizations.create({
				name: `${slug}-${random}`,
				slug: `${slug}-${random}`,
			});
		}
	}

	return organization;
};

const handleCompletion = async (
	api: Polar,
	slug: string,
	productCreate: ProductsCreateProductCreate,
) => {
	const organization = await resolveOrganization(api, slug);

	await api.products.create({
		...productCreate,
		organizationId: organization.id,
	});
};

const authenticationDisclaimer = async () => {
	const { unmount, clear, waitUntilExit } = render(
		<Spinner label="Opening browser for authentication..." />,
	);

	setTimeout(() => {
		clear();
		unmount();
	}, 1500);

	await waitUntilExit();
};

(async () => {
	const packageName = await resolvePackageName();

	const product = await productPrompt();

	await authenticationDisclaimer();

	const code = await login();

	const api = new Polar({
		accessToken: code,
		server: "sandbox",
	});

	await handleCompletion(api, packageName, product);

	const { templates } = await prompts({
		type: "multiselect",
		name: "templates",
		message: "Features to setup with your Next.js project",
		instructions: false,
		choices: [
			{ title: "Checkout Route", value: "checkout", selected: true },
			{ title: "Confirmation Page", value: "confirmation", selected: true },
			{ title: "Webhook Handler", value: "webhooks", selected: true },
		],
	});

	console.log(templates);
})();
