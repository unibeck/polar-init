import type { Polar } from "@polar-sh/sdk";
import type { Organization } from "@polar-sh/sdk/models/components";
import type { ProductsCreateProductCreate } from "@polar-sh/sdk/models/operations";

export const createProduct = async (
	api: Polar,
	organization: Organization,
	productCreate: ProductsCreateProductCreate,
) => {
	await api.products.create({
		...productCreate,
		organizationId: organization.id,
	});
};
