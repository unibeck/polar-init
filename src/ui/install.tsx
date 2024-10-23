import { Spinner } from "@inkjs/ui";
import { render } from "ink";
import React from "react";

export const installDisclaimer = async (promise: Promise<void>) => {
	const { unmount, clear, waitUntilExit } = render(
		<Spinner label="Installing dependencies..." />,
	);

	promise.then(() => {
		clear();
		unmount();
	});

	await waitUntilExit();
};
