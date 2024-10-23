import { Polar } from "@polar-sh/sdk";
import { login } from "./oauth.js";
import { productPrompt } from "./prompts/product.js";
import { resolvePackageName } from "./package.js";
import { createProduct } from "./product.js";
import { resolveOrganization } from "./organization.js";
import { templatePrompt } from "./prompts/template.js";
import { authenticationDisclaimer } from "./ui/authentication.js";
import { precheckDisclaimer } from "./ui/precheck.js";
import meow from "meow";
import { copyCheckoutTemplate, copyPolarClientTemplate, copyWebhooksTemplate } from "./template.js";
import { installDependencies } from "./dependencies.js";
import { installDisclaimer } from "./ui/install.js";

const cli = meow(`
	Usage
	  $ polar-init

	Options
	  --skip-precheck  Skips the Next.js project check
	  --skip-product  Skips the product prompt
	  --skip-authentication  Skips the authentication prompt
	  --skip-template  Skips the template prompt
`, {
	importMeta: import.meta,
	flags: {
		skipProduct: {
			type: "boolean",
			default: false,
		},
		skipPrecheck: {
			type: "boolean",
			default: false,
		},
		skipTemplate: {
			type: "boolean",
			default: false,
		},
	},
});

(async () => {
	if (!cli.flags.skipPrecheck) {
		await precheckDisclaimer();
	}

	const packageName = await resolvePackageName();

	if (!cli.flags.skipProduct) {
		const product = await productPrompt();

		await authenticationDisclaimer();
		const code = await login();
	
		const api = new Polar({
			accessToken: code,
			server: "sandbox",
		});
	
		const organization = await resolveOrganization(api, packageName);
	
		await createProduct(api, organization, product);
	}

	if (!cli.flags.skipTemplate) {
		const templates = await templatePrompt();
		
		await copyPolarClientTemplate();

		if (templates.includes('checkout')) {
			await copyCheckoutTemplate();
		}

		if (templates.includes('webhooks')) {
			await copyWebhooksTemplate();
		}

		const baseDependencies = ["@polar-sh/sdk"]
		const webhooksDependencies = ["standardwebhooks"]

		await installDisclaimer(
			installDependencies(templates.includes('webhooks') ? [...baseDependencies, ...webhooksDependencies] : baseDependencies)
		)
	}
})();
