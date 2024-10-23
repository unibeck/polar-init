import prompts from "prompts";

export const organizationPrompt = async () => {
    const { slug } = await prompts([
        {
            type: "text",
            name: "slug",
            message: "Organization Slug",
        },
    ]);

    return slug;
}