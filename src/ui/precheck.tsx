import { Spinner, StatusMessage } from "@inkjs/ui";
import { Text, render } from "ink";
import React from "react";
import { isNextDirectory } from "../utils.js";

const precheck = async () => {
	if (!isNextDirectory()) {
		const { unmount, clear, waitUntilExit } = render(
			<StatusMessage variant="error">
				<Text>This is not a Next.js project</Text>
			</StatusMessage>,
		);

		setTimeout(() => {
			clear();
			unmount();
		}, 1000);

		await waitUntilExit();

		process.exit(1);
	}
};

export const precheckDisclaimer = async () => {
	const { unmount, clear, waitUntilExit } = render(
		<Spinner label="Analyzing your Next.js project..." />,
	);

	setTimeout(() => {
		clear();
		unmount();
	}, 1000);

	await waitUntilExit();

	await precheck();
};
