import { polar } from "../../polar";
import { defineEventHandler, useQuery, sendRedirect } from "h3";

export default defineEventHandler(async (event) => {
	const query = useQuery(event);
	const productPriceId = query.priceId ?? "";
	const successUrl = `${event.node.req.protocol}//${event.node.req.headers.host}/confirmation?checkout_id={CHECKOUT_ID}`;

	try {
		const result = await polar.checkouts.custom.create({
			productPriceId,
			successUrl,
		});

		return sendRedirect(event, result.url);
	} catch (error) {
		console.error(error);
		event.res.statusCode = 500;
		return { error: "Internal Server Error" };
	}
});
