import fs from "node:fs";
import path from "node:path";

const resolveAppDirectory = () => {
	const workingDirectory = process.cwd();

	// find the app directory which can be either app, src/app, or pages for Nuxt v3
	const appPath = path.join(workingDirectory, "app");
	const srcAppPath = path.join(workingDirectory, "src", "app");
	const pagesPath = path.join(workingDirectory, "pages");
	const srcPagesPath = path.join(workingDirectory, "src", "pages");

	if (fs.existsSync(appPath)) {
		return appPath;
	}

	if (fs.existsSync(srcAppPath)) {
		return srcAppPath;
	}

	if (fs.existsSync(pagesPath)) {
		return pagesPath;
	}

	if (fs.existsSync(srcPagesPath)) {
		return srcPagesPath;
	}

	throw new Error(
		'App directory not found. Expected either "app", "src/app", "pages", or "src/pages" directory.',
	);
};

const copyTemplate = async (
	templatePath: string,
	targetPath = resolveAppDirectory(),
	isFile = false,
) => {
	const cliDirectory = import.meta.dirname;

	const templateDirectory = path.join(cliDirectory, "templates", templatePath);

	if (isFile) {
		fs.copyFileSync(
			templateDirectory,
			path.join(targetPath, templatePath),
		);
	} else {
		fs.cpSync(templateDirectory, path.join(targetPath, templatePath), { recursive: true });
	}
};

export const copyPolarClientTemplate = async () => {
	copyTemplate("polar.ts", path.join(resolveAppDirectory(), ".."), true);
};

export const copyProductsTemplate = async () => {
	copyTemplate("products");
};

export const copyCheckoutTemplate = async () => {
	copyTemplate("checkout");
};

export const copyWebhooksTemplate = async () => {
	copyTemplate("api");
};
