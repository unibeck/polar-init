export default function Page({
	searchParams: { checkout_id },
}: {
	searchParams: {
		checkout_id: string;
	};
}) {
	// Checkout has been confirmed
	// Now, make sure to capture the Checkout.updated webhook event to update the order status in your system

	return (
		<div>
			<h1>Thank you! Your checkout is now being processed.</h1>
		</div>
	);
}
