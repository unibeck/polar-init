import { Webhook } from "standardwebhooks";

import type {
	WebhookCheckoutCreatedPayload,
	WebhookCheckoutUpdatedPayload,
	WebhookSubscriptionActivePayload,
	WebhookSubscriptionCanceledPayload,
	WebhookSubscriptionCreatedPayload,
	WebhookSubscriptionRevokedPayload,
	WebhookSubscriptionUpdatedPayload,
} from "@polar-sh/sdk/models/components";
import { type NextRequest, NextResponse } from "next/server";

type WebhookEvent =
	| WebhookCheckoutCreatedPayload
	| WebhookCheckoutUpdatedPayload
	| WebhookSubscriptionCreatedPayload
	| WebhookSubscriptionActivePayload
	| WebhookSubscriptionCanceledPayload
	| WebhookSubscriptionUpdatedPayload
	| WebhookSubscriptionRevokedPayload;

export async function POST(request: NextRequest) {
	const requestBody = await request.text();

	const webhookHeaders = {
		"webhook-id": request.headers.get("webhook-id") ?? "",
		"webhook-timestamp": request.headers.get("webhook-timestamp") ?? "",
		"webhook-signature": request.headers.get("webhook-signature") ?? "",
	};

	const webhookSecret = Buffer.from(process.env.POLAR_WEBHOOK_SECRET!).toString(
		"base64",
	);
	const wh = new Webhook(webhookSecret);
	const webhookPayload = wh.verify(requestBody, webhookHeaders) as WebhookEvent;

	console.log("Incoming Webhook", webhookPayload.type);

	// Handle the event
	switch (webhookPayload.type) {
		// Checkout has been created
		case "checkout.created":
			break;

		// Checkout has been updated - this will be triggered when checkout status goes from confirmed -> succeeded
		case "checkout.updated":
			break;

		// Subscription has been created
		case "subscription.created":
			break;

		// A catch-all case to handle all subscription webhook events
		case "subscription.updated":
			break;

		// Subscription has been activated
		case "subscription.active":
			break;

		// Subscription has been revoked/peroid has ended with no renewal
		case "subscription.revoked":
			break;

		// Subscription has been explicitly canceled by the user
		case "subscription.canceled":
			break;

		default:
			console.log(`Unhandled event type ${webhookPayload.type}`);
	}

	return NextResponse.json({ received: true });
}