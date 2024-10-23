import fs from 'fs';
import path from 'path';

export const isNextDirectory = (directory: string = process.cwd()): boolean => {
  const nextIndicators = [
    'next.config.js',
    'next.config.mjs',
    'pages',
    'app',
  ];

  return nextIndicators.some(indicator => 
    fs.existsSync(path.join(directory, indicator))
  );
};