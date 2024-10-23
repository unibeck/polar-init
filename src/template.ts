import fs from "node:fs";
import path from "node:path";

const resolveAppDirectory = () => {
	const workingDirectory = process.cwd();

	// find the app directory which can be either app or src/app
	const appPath = path.join(workingDirectory, "app");
	const srcAppPath = path.join(workingDirectory, "src", "app");

	if (fs.existsSync(appPath)) {
		return appPath;
	}

	if (fs.existsSync(srcAppPath)) {
		return srcAppPath;
	}

	throw new Error(
		'App directory not found. Expected either "app" or "src/app" directory.',
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
			path.join(templateDirectory),
			path.join(targetPath, templatePath),
		);
	} else {
		fs.cpSync(templateDirectory, targetPath, { recursive: true });
	}
};

export const copyPolarClientTemplate = async () => {
	copyTemplate("polar.ts", path.join(resolveAppDirectory(), ".."), true);
};

export const copyCheckoutTemplate = async () => {
	copyTemplate("checkout");
};

export const copyWebhooksTemplate = async () => {
	copyTemplate("api");
};
