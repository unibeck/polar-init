import type { Polar } from "@polar-sh/sdk";
import type { Organization } from "@polar-sh/sdk/models/components";
import { organizationPrompt } from "./prompts/organization.js";

export const resolveOrganization = async (api: Polar, slug: string) => {
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
			const slug = await organizationPrompt();

			organization = await api.organizations.create({
				name: slug,
				slug,
			});
		}
	}

	return organization;
};
