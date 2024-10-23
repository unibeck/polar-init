import { Polar } from "@polar-sh/sdk";
import { ProductsCreateProductCreate } from "@polar-sh/sdk/models/operations";
import { Organization } from "@polar-sh/sdk/models/components";

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