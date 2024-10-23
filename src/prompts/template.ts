import prompts from "prompts";

export const templatePrompt = async () => {
	const { templates } = await prompts({
		type: "multiselect",
		name: "templates",
		message: "Polar Features",
		instructions: false,
		choices: [
			{ title: "Checkout Routes", value: "checkout", selected: true },
			{ title: "Webhook Handler", value: "webhooks", selected: true },
		],
	});

	return templates;
};
