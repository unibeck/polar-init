import path from 'node:path';
import fs from 'node:fs/promises';

const envFiles = ['.env', '.env.local'];

const resolveEnvPaths = async () => {
    const cwd = process.cwd();
    const paths = envFiles.map(file => path.join(cwd, file));

    const existingFiles = await Promise.all(
        paths.map(async (filePath) => {
            try {
                await fs.access(filePath);
                return filePath;
            } catch {
                return null;
            }
        })
    );

    return existingFiles.filter(Boolean);
};

export const appendEnvironmentVariables = async (variables: Record<string, string>) => {
    const envPaths = await resolveEnvPaths();

    for (const envPath of envPaths) {
        if (!envPath) continue;

        const envFile = await fs.readFile(envPath, 'utf8');

        const newEnvFile = Object.entries(variables).reduce((acc, [key, value]) => {
            if (!acc.includes(`${key}=`)) {
                return `${acc}\n${key}=${value}`;
            }
            return acc;
        }, envFile);

        await fs.writeFile(envPath, newEnvFile);
    }
}