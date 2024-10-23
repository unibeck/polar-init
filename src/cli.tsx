import { Polar } from "@polar-sh/sdk";
import meow from "meow";
import { installDependencies } from "./install.js";
import { login } from "./oauth.js";
import { resolveOrganization } from "./organization.js";
import { resolvePackageName } from "./package.js";
import { createProduct } from "./product.js";
import { productPrompt } from "./prompts/product.js";
import { templatePrompt } from "./prompts/template.js";
import {
	copyCheckoutTemplate,
	copyPolarClientTemplate,
	copyWebhooksTemplate,
} from "./template.js";
import { authenticationDisclaimer } from "./ui/authentication.js";
import { installDisclaimer } from "./ui/install.js";
import { precheckDisclaimer } from "./ui/precheck.js";
import { environmentDisclaimer } from "./ui/environment.js";
import { appendEnvironmentVariables } from "./env.js";

const cli = meow(
	`
	Usage
	  $ polar-init

	Options
	  --skip-precheck  Skips the Next.js project check
	  --skip-product  Skips the product prompt
	  --skip-authentication  Skips the authentication prompt
	  --skip-template  Skips the template prompt
`,
	{
		importMeta: import.meta,
		flags: {
			skipPrecheck: {
				type: "boolean",
				default: false,
			},
			skipTemplate: {
				type: "boolean",
				default: false,
			},
		},
	},
);

(async () => {
	if (!cli.flags.skipPrecheck) {
		await precheckDisclaimer();
	}

	const product = await productPrompt();

	await authenticationDisclaimer();
	const code = await login();

	const api = new Polar({
		accessToken: code,
		server: "sandbox",
	});

	const packageName = await resolvePackageName();
	const organization = await resolveOrganization(api, packageName);

	await createProduct(api, organization, product);


	if (!cli.flags.skipTemplate) {
		const templates = await templatePrompt();

		await copyPolarClientTemplate();

		const shouldCopyCheckout = templates.includes("checkout");
		const shouldCopyWebhooks = templates.includes("webhooks");

		if (shouldCopyCheckout) {
			await copyCheckoutTemplate();
		}

		if (shouldCopyWebhooks) {
			await copyWebhooksTemplate();
		}

		const baseDependencies = ["@polar-sh/sdk"];
		const webhooksDependencies = ["standardwebhooks"];

		await installDisclaimer(
			installDependencies(
				shouldCopyWebhooks
					? [...baseDependencies, ...webhooksDependencies]
					: baseDependencies,
			),
		);

		// Handle environment variables
		await environmentDisclaimer(appendEnvironmentVariables( shouldCopyWebhooks ? {
			// POLAR_ACCESS_TOKEN: accessToken,
			POLAR_ORGANIZATION_ID: organization.id
		} : {
			POLAR_ORGANIZATION_ID: organization.id
		}));
	}
})();
