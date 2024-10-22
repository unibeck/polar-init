import React, { useCallback } from "react";
import { CreateProduct } from "./views/CreateProduct.js";
import { PolarProvider } from "./providers/PolarProvider.js";
import type { ProductsCreateProductCreate } from "@polar-sh/sdk/models/operations/productscreate.js";
import { login } from "./oauth.js";
import { Polar } from "@polar-sh/sdk";
import type { Organization } from "@polar-sh/sdk/models/components/organization.js";

export const App = () => {
	const resolveOrganization = useCallback(async (api: Polar, slug: string) => {
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
				const random = Math.floor(Math.random() * 1000);
				organization = await api.organizations.create({
					name: `${slug}-${random}`,
					slug: `${slug}-${random}`,
				});
			}
		}

		return organization;
	}, []);

	const handleCompletion = useCallback(
		async (productCreate: ProductsCreateProductCreate) => {
			const code = await login();
			const api = new Polar({
				accessToken: code,
				server: "sandbox",
			});

			const organization = await resolveOrganization(api, "my-app");

			api.products
				.create({ ...productCreate, organizationId: organization.id })
				.then((product) => {
					console.log("Product created:");
					console.dir(product, { depth: Number.POSITIVE_INFINITY });
				});
		},
		[resolveOrganization],
	);

	return (
		<PolarProvider>
			<CreateProduct onCompletion={handleCompletion} />
		</PolarProvider>
	);
};
