import prompts from "prompts";

export const templatePrompt = async () => {
	const { templates } = await prompts({
		type: "multiselect",
		name: "templates",
		message: "Features to setup with your Next.js project",
		instructions: false,
		choices: [
			{ title: "Checkout Route", value: "checkout", selected: true },
			{ title: "Confirmation Page", value: "confirmation", selected: true },
			{ title: "Webhook Handler", value: "webhooks", selected: true },
		],
	});

	return templates;
};
